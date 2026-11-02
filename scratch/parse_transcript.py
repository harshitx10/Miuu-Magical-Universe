import json

log_path = r'C:\Users\Hp\.gemini\antigravity\brain\42fad0d4-356a-4a7e-b521-308a63abb377\.system_generated\logs\transcript.jsonl'

with open(log_path, 'r', encoding='utf-8') as f:
    f_lines = f.readlines()
print(f"Total steps: {len(f_lines)}")

for i, line in enumerate(f_lines):
    try:
        data = json.loads(line)
        source = data.get('source')
        type_ = data.get('type')
        status = data.get('status')
        print(f"Step {i}: source={source}, type={type_}, status={status}")
        
        # Print content if it is user input or planner response
        content = data.get('content') or ""
        if content and len(content) > 0:
            preview = content[:200].replace('\n', ' ')
            print(f"  Content preview: {preview}...")
            if "plan" in content.lower() or "treasure" in content.lower():
                print(f"  [FULL CONTENT CONTAINING KEYWORD]:\n{content}\n")
        
        # Check tool calls
        tool_calls = data.get('tool_calls', [])
        if tool_calls:
            print("  Tool calls:")
            for tc in tool_calls:
                name = tc.get('name') or tc.get('function', {}).get('name')
                args = tc.get('arguments') or tc.get('function', {}).get('arguments')
                print(f"    Name: {name}")
                print(f"    Args preview: {str(args)[:200]}")
    except Exception as e:
        print(f"Error on line {i}: {e}")
