// MarkdownLite — basit markdown renderer (explanation için)
// Destekler: **bold**, `code`, # heading, listeler, ```codeblock```
// XSS güvenli — escape + sadece izinli HTML

import { ReactNode } from "react";

export default function MarkdownLite({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  let codeBlock: string[] | null = null;

  lines.forEach((line, idx) => {
    // Code block start/end
    if (line.trim().startsWith("```")) {
      if (codeBlock === null) {
        codeBlock = [];
      } else {
        blocks.push(
          <pre key={`cb-${idx}`} className="my-3 p-3 rounded-lg bg-black/40 border border-white/10 overflow-x-auto">
            <code className="text-xs font-mono text-emerald-300 leading-relaxed">
              {codeBlock.join("\n")}
            </code>
          </pre>
        );
        codeBlock = null;
      }
      return;
    }
    if (codeBlock !== null) {
      codeBlock.push(line);
      return;
    }

    if (!line.trim()) {
      blocks.push(<div key={`sp-${idx}`} className="h-2" />);
      return;
    }

    if (line.startsWith("### ")) {
      blocks.push(<h4 key={idx} className="text-sm font-semibold text-white/90 mt-3 mb-1">{formatInline(line.slice(4))}</h4>);
      return;
    }
    if (line.startsWith("## ")) {
      blocks.push(<h3 key={idx} className="text-base font-semibold text-white mt-3 mb-1.5">{formatInline(line.slice(3))}</h3>);
      return;
    }
    if (line.startsWith("# ")) {
      blocks.push(<h2 key={idx} className="text-lg font-bold text-white mt-4 mb-2">{formatInline(line.slice(2))}</h2>);
      return;
    }

    const numMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (numMatch) {
      blocks.push(
        <div key={idx} className="flex gap-2.5 my-1.5 leading-relaxed">
          <span className="text-indigo-400 font-mono text-xs mt-1 flex-shrink-0">{numMatch[1]}.</span>
          <span className="flex-1">{formatInline(numMatch[2])}</span>
        </div>
      );
      return;
    }

    if (line.startsWith("- ") || line.startsWith("* ")) {
      blocks.push(
        <div key={idx} className="flex gap-2 my-1 leading-relaxed">
          <span className="text-white/40 mt-1.5">•</span>
          <span className="flex-1">{formatInline(line.slice(2))}</span>
        </div>
      );
      return;
    }

    blocks.push(<p key={idx} className="my-2 leading-relaxed">{formatInline(line)}</p>);
  });

  if (codeBlock !== null) {
    blocks.push(
      <pre key="cb-final" className="my-3 p-3 rounded-lg bg-black/40 border border-white/10 overflow-x-auto">
        <code className="text-xs font-mono text-emerald-300">{(codeBlock as string[]).join("\n")}</code>
      </pre>
    );
  }

  return <div className="text-sm text-white/80">{blocks}</div>;
}

function formatInline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
    const codeMatch = remaining.match(/`([^`]+)`/);

    const boldIdx = boldMatch?.index ?? Infinity;
    const codeIdx = codeMatch?.index ?? Infinity;

    if (boldIdx === Infinity && codeIdx === Infinity) {
      parts.push(<span key={key++}>{remaining}</span>);
      break;
    }

    if (boldIdx < codeIdx && boldMatch) {
      if (boldIdx > 0) parts.push(<span key={key++}>{remaining.slice(0, boldIdx)}</span>);
      parts.push(<strong key={key++} className="font-semibold text-white">{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldIdx + boldMatch[0].length);
    } else if (codeMatch) {
      if (codeIdx > 0) parts.push(<span key={key++}>{remaining.slice(0, codeIdx)}</span>);
      parts.push(<code key={key++} className="px-1.5 py-0.5 rounded bg-black/40 text-emerald-300 text-[12px] font-mono">{codeMatch[1]}</code>);
      remaining = remaining.slice(codeIdx + codeMatch[0].length);
    }
  }

  return parts;
}