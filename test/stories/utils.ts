
export function makeArgType(param: {
    type: "array" | "text" | "radio" | "object" | "number" | "boolean";
    description?: string;
    defaultValue: any;
    category?: string;
    control?: Record<string, any>;
    table?: Record<string, any>;
}) {
    return {
        control: {
            type: param.type,
            ...(param.control || {})
        },
        table: {
            defaultValue: { summary: param.defaultValue },
            category: param.category,
            ...(param.table || {}),
        },
        description: param.description,
    };
}
export function makeArgs(argTypes: any) {
    return Object.keys(argTypes).reduce((prev, cur) => {
        prev[cur] = argTypes[cur].table.defaultValue.summary;

        return prev;
    }, {} as Record<string, any>);
}
