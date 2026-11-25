import React from 'react';

function renderInline(text: string): React.ReactNode[] {
  const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return tokens.map((tok, i) => {
    if (tok.startsWith('`') && tok.endsWith('`') && tok.length >= 2) {
      return (
        <code key={i} className="md-inline-code">
          {tok.slice(1, -1)}
        </code>
      );
    }
    if (tok.startsWith('**') && tok.endsWith('**') && tok.length >= 4) {
      return <strong key={i}>{tok.slice(2, -2)}</strong>;
    }
    if (tok.startsWith('*') && tok.endsWith('*') && tok.length >= 2) {
      return <em key={i}>{tok.slice(1, -1)}</em>;
    }
    return <React.Fragment key={i}>{tok}</React.Fragment>;
  });
}

export const MarkdownView: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let keySeq = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.trimStart().startsWith('```')) {
      const lang = line.trimStart().slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // consume closing ```
      blocks.push(
        <div key={keySeq++} className="md-code-block">
          {lang && <div className="md-code-lang">{lang}</div>}
          <pre>
            <code>{codeLines.join('\n')}</code>
          </pre>
        </div>
      );
      continue;
    }

    if (line.trim() === '') {
      i++;
      continue;
    }

    if (line.startsWith('### ')) {
      blocks.push(
        <h4 key={keySeq++} className="md-h3">
          {renderInline(line.slice(4))}
        </h4>
      );
      i++;
      continue;
    }

    if (line.startsWith('## ')) {
      blocks.push(
        <h3 key={keySeq++} className="md-h2">
          {renderInline(line.slice(3))}
        </h3>
      );
      i++;
      continue;
    }

    if (line.startsWith('# ')) {
      blocks.push(
        <h2 key={keySeq++} className="md-h1">
          {renderInline(line.slice(2))}
        </h2>
      );
      i++;
      continue;
    }

    if (line.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      blocks.push(
        <blockquote key={keySeq++} className="md-blockquote">
          {renderInline(quoteLines.join(' '))}
        </blockquote>
      );
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ''));
        i++;
      }
      blocks.push(
        <ul key={keySeq++} className="md-list">
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ''));
        i++;
      }
      blocks.push(
        <ol key={keySeq++} className="md-list md-olist">
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Paragraph
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trimStart().startsWith('```') &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('> ') &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i])
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    blocks.push(
      <p key={keySeq++} className="md-p">
        {renderInline(paraLines.join(' '))}
      </p>
    );
  }

  return <div className="md-root">{blocks}</div>;
};
