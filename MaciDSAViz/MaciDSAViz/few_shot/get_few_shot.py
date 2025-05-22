def analyze_files(file_list):
    output = []
    i = 1
    for filepath in file_list:
        with open(f'./MaciDSAViz/dataset/iDSAViz150/{filepath}', 'r', encoding='utf-8') as f:
            content1 = f.read()
        with open(f'./MaciDSAViz/dataset/iDSAViz150/{filepath[:-4]}.js', 'r', encoding='utf-8') as f:
            content2 = f.read()

        output.append(f"Example{i}:")
        output.append(content1)
        output.append("visualization code:")
        output.append(content2)
        output.append("")  

    return "\n".join(output)
