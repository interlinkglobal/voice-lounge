import { useEffect } from "react";

const EM_DASH = /\u2014/g;
const ATTRIBUTES = ["content", "title", "aria-label", "alt", "placeholder"] as const;
const SKIP_TEXT = new Set(["SCRIPT", "STYLE", "TEXTAREA"]);

function normalize(value: string) {
  return value.includes("\u2014") ? value.replace(EM_DASH, " - ") : value;
}

function normalizeTextNode(node: Text) {
  const parent = node.parentElement;
  if (parent && SKIP_TEXT.has(parent.tagName)) return;
  const next = normalize(node.data);
  if (next !== node.data) node.data = next;
}

function normalizeElement(element: Element) {
  for (const attribute of ATTRIBUTES) {
    const value = element.getAttribute(attribute);
    if (!value) continue;
    const next = normalize(value);
    if (next !== value) element.setAttribute(attribute, next);
  }
}

function normalizeSubtree(root: Node) {
  if (root.nodeType === Node.TEXT_NODE) {
    normalizeTextNode(root as Text);
    return;
  }

  if (root instanceof Element) normalizeElement(root);

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
  );

  let current = walker.nextNode();
  while (current) {
    if (current.nodeType === Node.TEXT_NODE) normalizeTextNode(current as Text);
    else if (current instanceof Element) normalizeElement(current);
    current = walker.nextNode();
  }
}

export function EmDashNormalizer() {
  useEffect(() => {
    normalizeSubtree(document.documentElement);

    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "characterData" && record.target.nodeType === Node.TEXT_NODE) {
          normalizeTextNode(record.target as Text);
          continue;
        }

        if (record.type === "attributes" && record.target instanceof Element) {
          normalizeElement(record.target);
          continue;
        }

        record.addedNodes.forEach(normalizeSubtree);
      }
    });

    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...ATTRIBUTES],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
