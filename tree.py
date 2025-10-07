#!/usr/bin/env python3
import os
import argparse

def print_tree(root, ignore_names, ignore_exts, out_file, indent=""):
    for item in sorted(os.listdir(root)):
        if item in ignore_names:
            continue

        path = os.path.join(root, item)

        # check extension
        _, ext = os.path.splitext(item)
        if ext.lstrip(".").lower() in ignore_exts:
            continue

        line = f"{indent}📂 {item}" if os.path.isdir(path) else f"{indent}📄 {item}"
        print(line)
        out_file.write(line + "\n")

        if os.path.isdir(path):
            print_tree(path, ignore_names, ignore_exts, out_file, indent + "    ")
        else:
            try:
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read(200)  # show first 200 chars
                    for line in content.splitlines():
                        data = f"{indent}    → {line}"
                        print(data)
                        out_file.write(data + "\n")
            except Exception as e:
                err = f"{indent}    [Ошибка чтения: {e}]"
                print(err)
                out_file.write(err + "\n")

def main():
    parser = argparse.ArgumentParser(description="Показать дерево файлов и сохранить в AGENTS.txt")
    parser.add_argument("path", help="Путь к директории")
    parser.add_argument("--ignore", nargs="*", default=[], help="Игнорируемые имена файлов или папок")
    parser.add_argument("--ignore-ext", nargs="*", default=[], help="Игнорируемые расширения файлов (без точки)")
    parser.add_argument("--output", default="AGENTS.txt", help="Файл для сохранения результата (по умолчанию AGENTS.txt)")
    args = parser.parse_args()

    if not os.path.isdir(args.path):
        print(f"Ошибка: {args.path} не является директорией")
        return

    with open(args.output, "w", encoding="utf-8") as out_file:
        header = f"Дерево файлов для {args.path}:\n"
        print(header)
        out_file.write(header + "\n")
        print_tree(args.path, set(args.ignore), set(map(str.lower, args.ignore_ext)), out_file)

if __name__ == "__main__":
    main()
