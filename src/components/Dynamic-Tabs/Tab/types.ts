export interface TabData {
    label: string;
    content: React.ReactNode;
    value: number;
}

export interface ListItem {
    id?: string;
    [key: string]: any;
}
