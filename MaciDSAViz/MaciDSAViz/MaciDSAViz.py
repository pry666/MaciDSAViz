import os
from executor_i import error_code
from few_shot.test_sim import compute_similarity
from few_shot.get_few_shot import analyze_files
from data_shuffle.test import get_top3_matches,get_top1_matches
import re
import os
from dotenv import find_dotenv, load_dotenv
from typing_extensions import Annotated
from typing import Literal
from typing_extensions import TypedDict
from langgraph.graph import StateGraph,START,END,MessagesState
from langgraph.graph.message import add_messages
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import BaseMessage, HumanMessage
from langgraph.types import Command
import json
from langchain_core.messages import SystemMessage
from transformers import AutoTokenizer
from langchain.schema import HumanMessage 
import pandas as pd
from langchain_openai import ChatOpenAI
MODEL_PATH = "xxxxx"
port = "xxxxx"

tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH,trust_remote_code=True)
max_token_limit = 32600
memory = []

def truncate_prompt_from_end(message, max_tokens):
    content = message.content
    tokens = tokenizer.encode(content)

    if len(tokens) <= max_tokens:
        return message

    truncated_content = tokenizer.decode(tokens[:max_tokens])
    return type(message)(content=truncated_content)


def truncate_messages_reserving_last_human(
    messages
):
    last_human_index = -1
    for i in range(len(messages)-1, -1, -1):
        if isinstance(messages[i], HumanMessage):
            last_human_index = i
            break

    if last_human_index == -1:
        return messages

    preserved = messages[last_human_index:]
    prefix = messages[:last_human_index]

    preserved_token = sum(count_message_tokens(msg) for msg in preserved)

    remaining_tokens = max_token_limit - preserved_token
    if remaining_tokens <= 0:
        preserved_msg = preserved[0]
        content_tokens = tokenizer.encode(preserved_msg.content)
        trimmed_content = tokenizer.decode(content_tokens[-max_token_limit:])
        return [HumanMessage(content=trimmed_content)]

    truncated_prefix = []
    total_prefix_token = 0

    for msg in prefix:
        msg_tokens = count_message_tokens(msg)
        if total_prefix_token + msg_tokens <= remaining_tokens:
            truncated_prefix.append(msg)
            total_prefix_token += msg_tokens
        elif isinstance(msg, HumanMessage):
            content_tokens = tokenizer.encode(msg.content)
            allowed_tokens = remaining_tokens - total_prefix_token - count_message_tokens(HumanMessage(content=""))
            if allowed_tokens > 0:
                trimmed_content = tokenizer.decode(content_tokens[-allowed_tokens:])
                truncated_prefix.append(HumanMessage(content=trimmed_content))
                total_prefix_token += count_message_tokens(HumanMessage(content=trimmed_content))
        break  

    return truncated_prefix + preserved

def prepend_system_prompt(state, addition: str):
    messages = state.get("messages", [])
    if not isinstance(messages, list):
        raise ValueError("messages must be a list")

    new_messages = []
    for msg in messages:
        if isinstance(msg, HumanMessage):
            msg = truncate_prompt_from_end(msg,max_token_limit)
            last_human = msg
        new_messages.append(msg)

    if not new_messages:
        raise ValueError("No messages to modify")

    for i in range(len(new_messages)-1, -1, -1):
        if isinstance(new_messages[i], HumanMessage):
            updated = HumanMessage(content=new_messages[i].content + addition)
            new_messages[i] = updated
            break

    return truncate_messages_reserving_last_human(new_messages)

def count_message_tokens(msg):
    role = "user" if isinstance(msg, HumanMessage) else (
        "assistant" if isinstance(msg, AIMessage) else "system"
    )
    return len(tokenizer.encode(msg.content)) + 4

def find_most_similar_memory(current_error, memory, threshold=0.2):
    best_match = None
    best_score = 0

    for item in memory:
        past_error = item.get("error_message", "")
        score = difflib.SequenceMatcher(None, current_error, past_error).ratio()
        if score > best_score:
            best_score = score
            best_match = item

    if best_score >= threshold:
        return best_match
    else:
        return None

final_result = ""
error_messages = ""
code_flow = ""
API_calls = ""
examples = ""

def route_by_code(final_code: str) -> Literal["Feedback", END]:
    global error_messages
    error_messages = ""
    if not isinstance(final_code, str):
        final_code = str(final_code)
    code_blocks = None
    code_blocks = re.findall(r'```(?:javascript)\s*(.*?)\s*```', final_code, re.DOTALL | re.IGNORECASE)
    if not code_blocks:
        return "Feedback"
    else:
        errors = []
        code = code_blocks[-1].strip()
        errors = error_code(code)
        if(len(errors) == 0):
            error_messages = ""
            return END
        else:
            error_messages = errors[0]
            return "Feedback"

def route_by_refine(feedback_result:str) -> Literal["Flow","API","Coding"]:
    if feedback_result == "A":
       return  "Flow"
    elif feedback_result == "B":
       return  "API"
    else:
       return  "Coding"
    
graph_builder = StateGraph(MessagesState)

llm = ChatOpenAI(    
    api_key="EMPTY",
    base_url=f"http://localhost:{port}/v1",
    model=MODEL_PATH
)

def make_system_prompt(suffix:str) -> str:
    return (
        "You are a helpful AI assistant, collaborating with other assistants."
        f"\n{suffix}"
    )

def get_next_node(last_message: BaseMessage, goto: str):
    if "FINAL ANSWER" in last_message.content:
        return END
    return goto

Code_ana_agent = create_react_agent(
    llm,
    tools=[],
    prompt="",
)

def Code_ana_node(
    state: MessagesState,
) -> Command[Literal["Coding"]]:
    global code_flow
    input_msgs = prepend_system_prompt(state, make_system_prompt(
        """You can only analyze the flow of the algorithm python code. \n
        You should analyze how the algorithm python code works step by step.\n
        Don't output the visualization code.\n
        You are working with a code generator colleague.\n
        ### STRICT FORMAT REQUIREMENT: Do NOT include explanations, extra text, comments, codes or any other formatting—ONLY return the steps of the algorithm python code.\n
        For example:\n
        Step1:...\n
        Step2:...\n
        """
    ))

    result = Code_ana_agent.invoke({"messages": input_msgs})
    code_flow = result["messages"][-1].content
    goto = get_next_node(result["messages"][-1], "Coding")

    result["messages"][-1] = HumanMessage(
        content=result["messages"][-1].content, name="Flow"
    )
    print("Flow:"+goto)
    return Command(
        update={
            "messages": result["messages"],
        },
        goto=goto,
    )


API_sel_agent = create_react_agent(
    llm,
    tools=[],
    prompt="",
)

def API_sel_node(
    state: MessagesState,
) -> Command[Literal["Coding"]]:
    global API_calls
    input_msgs = prepend_system_prompt(state, make_system_prompt(
        f"""You can only select the useful API calls from API document.\n
        You should select what API calls can be used for the algorithm visualization.\n
        You should only give the list of the API calls could be used to visualization and the use of the API.\n
        All API calls:\n
        {API_documents}
        For example:\n
        [Createlabel,Connect,Step,....]\n
        ### STRICT FORMAT REQUIREMENT: Do NOT include explanations, extra text, comments, codes, or any other formatting—ONLY return the list.\n"""
    ))

    result = API_sel_agent.invoke({"messages": input_msgs})
    API_calls = result["messages"][-1].content
    goto = get_next_node(result["messages"][-1], "Coding")

    result["messages"][-1] = HumanMessage(
        content=result["messages"][-1].content, name="API"
    )
    print("API:"+goto)
    return Command(
        update={
            "messages": result["messages"],
        },
        goto=goto,
    )


Code_gen_agent = create_react_agent(
    llm,
    tools=[],
    prompt="",
)

def Code_gen_node(
    state: MessagesState
):
    global final_result
    global error_messages
    global examples
    global API_calls
    global code_flow
    if (API_calls != "" and code_flow != ""):
        input_msgs = prepend_system_prompt(state, make_system_prompt(
            f"""You can only generate codes. You are working with a code analysis and a tools selection colleague.\n
            Following are the tutorials:\n
            {tutorials}\n
            According to the steps of algorithm python code and the list of API calls to generate visualization.\n
            Following are the flow:\n
            {code_flow}\n
            Following are the selected APIs:\n
            {API_calls}\n
            Following are the examples:\n
            {examples}\n
            You should give me the whole visiualization code of the algorithm."""
        ))
        result = Code_gen_agent.invoke({"messages": input_msgs})


        final_result = result["messages"][-1].content
        goto = route_by_code(final_result)
        result["messages"][-1] = HumanMessage(
            content=result["messages"][-1].content, name="Code_gen"
        )
        

        return Command(
            update={"messages": result["messages"][-1]},
            goto=goto
        )


Wrong_ana_agent = create_react_agent(
    llm,
    tools=[],
    prompt="",
)

def Wrong_ana_node(
    state: MessagesState
) -> Command[Literal["Flow","API","Coding"]]:
    global final_result
    global error_messages
    global API_calls
    global code_flow
    global memory
    global memory
    global feedback_result

    related_case = find_most_similar_memory(error_messages, memory)
    prompt_wrong = f"""
    Final Code:\n
    {final_result}\n

    Error messages:\n
    {error_messages}\n

    Memory List:\n
    {related_case}

    You should analyze the error occurs in which step and return the choice.
    Following are three choices you can select:
    A.Code flow error:error messages caused bu the wrong Code Flow.\n
    B.API error:error messages caused by the API calls.\n
    C.Code generation error:error messages caused by javascript code.\n

    ### STRICT FORMAT REQUIREMENT: Do NOT include explanations, extra text, comments, codes, or any other formatting—ONLY Please output A, B or C.\n
    """

    input_msgs = prepend_system_prompt(state, make_system_prompt(prompt_wrong))

    result = Wrong_ana_agent.invoke({"messages": input_msgs})
    feedback_result = result["messages"][-1].content
    
    goto = route_by_refine(feedback_result)

    memory.append({
        "error_message": error_messages,
        "Feedback_result": feedback_result
    })

    return Command(
        goto=goto
    )


graph_builder.add_node("Flow", Code_ana_node)
graph_builder.add_node("API", API_sel_node)
graph_builder.add_node("Coding", Code_gen_node)
graph_builder.add_node("Feedback", Wrong_ana_node)

graph_builder.add_edge(START,"Flow")
graph_builder.add_edge(START,"API")
graph_builder.add_edge(["Flow", "API"], "Coding")
graph_builder.add_conditional_edges("Coding",lambda state: route_by_code(state["messages"][-1].content),{END: END, "Feedback": "Feedback"})
graph_builder.add_conditional_edges("Feedback",route_by_refine)


graph = graph_builder.compile()

tutorials = ""
with open(f"./documents/tutorials.txt", "r", encoding="utf-8") as f:
    content = f.read()
    tutorials = tutorials.join(content)

API_documents= ""
with open(f"./documents/API_documents.txt", "r", encoding="utf-8") as f:
    content = f.read()
    API_documents = API_documents.join(content)  


def get_prompt(pycode):
    query_tmp = f"""
    I want to do the visualization of the algorithm given below.Please give me whole complete javascript code of the visiualization beginning with '```javascript' and ending with '```'. 

    The name and python code of the algorithm:
    {py_code}
    """

    prompt = f"""
    Question:{query_tmp}
    """

    return prompt

df1 = pd.read_csv("./goal.csv")
df2 = pd.read_csv("./few-shot-examples.csv")

for index, row in df1.iterrows():
    simliar_list = []
    csv1_filename = row["filename"]
    difficulty = row["difficulty"]
    matched_filenames = df2[df2["difficulty"] == difficulty]["filename"].tolist()
    threshold = 0.5
    final_result = ""
    error_messages = ""
    code_flow = ""
    API_calls = ""
    examples = ""
    feedback_result = ""
    print("error:" + error_messages)
    with open(f"./dataset/iDsaViz150/{csv1_filename}", "r", errors='ignore') as f:
        py_code = f.read()

    prompt = get_prompt(py_code)
    simliar_list = get_top3_matches(csv1_filename,"./few-shot-examples.csv",threshold)
    examples = analyze_files(simliar_list)
    events = graph.stream(
        {
            "messages": [
                (
                    "user",
                    prompt,
                )
            ],
        },
        {"recursion_limit": 5},
    )

    try: 
        for s in events:
            pass
    except RecursionError:
        print("Reached the recursion limit and terminated.") 

    with open(f'./{csv1_filename}_result.txt', 'w', encoding='utf-8') as f:
        f.write(final_result)
