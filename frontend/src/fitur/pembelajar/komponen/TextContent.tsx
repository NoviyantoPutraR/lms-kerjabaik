
interface TextContentProps {
    content: string;
}

export function TextContent({ content }: TextContentProps) {
    return (
        <div className="prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    );
}
