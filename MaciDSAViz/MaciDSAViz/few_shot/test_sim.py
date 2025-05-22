from few_shot.TESD import Calculate
import os

def compute_similarity(file1, file_list):
    results = []
    with open(f'./MaciDSAViz/dataset/iDSAViz150/{file1}', 'r', encoding='utf-8') as f:
        line1 = f.read()

    for filepath in file_list:
        try:
            with open(f'./MaciDSAViz/dataset/iDSAViz150/{filepath}', 'r', encoding='utf-8') as f:
                line2 = f.read()

            score = Calculate("python", line1, line2, 1.0, 0.8, 1.0)
            results.append((filepath, score))

        except Exception as e:
            print(e)

    results.sort(key=lambda x: x[1], reverse=True)

    return [filepath for filepath, _ in results]

