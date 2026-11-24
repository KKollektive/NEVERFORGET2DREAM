"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { ArrowUp, MessageCircle, Sparkles, X } from "lucide-react"
import { useState } from "react"

const suggestions = ["Help me find a product", "What’s coming soon?", "Show me the different worlds"]

export function SiteGuideAssistant() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const { messages, sendMessage, regenerate, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/site-guide" }),
  })

  function submitMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed || status !== "ready") return
    sendMessage({ text: trimmed })
    setInput("")
  }

  return <>
    {!open && <button className="guide-launcher" onClick={() => setOpen(true)} aria-label="Ask the dream guide" aria-expanded={false}>
      <MessageCircle size={18} /><span>Ask the Dream Guide</span><i />
    </button>}
    {open && <section className="guide-panel" role="dialog" aria-label="Dream Guide chat" aria-modal="false">
      <header className="guide-header">
        <span className="guide-avatar"><Sparkles size={17} /></span>
        <div><b>Your Dream Guide</b><small>Here to help you find your way</small></div>
        <button className="guide-close" onClick={() => setOpen(false)} aria-label="Close Dream Guide"><X size={17} /></button>
      </header>
      <div className="guide-messages" aria-live="polite">
        {messages.length === 0 ? <div className="guide-welcome"><span>WELCOME TO THE UNIVERSE</span><p>Curious about a product, a world, or what&apos;s still on the way? I can point you in the right direction.</p><div className="guide-suggestions">{suggestions.map((suggestion) => <button key={suggestion} onClick={() => submitMessage(suggestion)}>{suggestion}</button>)}</div></div> : messages.map((message) => <div className={`guide-message guide-message-${message.role}`} key={message.id}>{message.parts.map((part, index) => part.type === "text" ? <p key={index}>{part.text}</p> : null)}</div>)}
        {(status === "submitted" || status === "streaming") && <div className="guide-typing" aria-label="Dream Guide is responding"><i /><i /><i /></div>}
        {error && <div className="guide-error" role="alert"><p>I couldn&apos;t reach the guide just now.</p><button onClick={() => regenerate()} type="button">Try again</button></div>}
      </div>
      <form className="guide-form" onSubmit={(event) => { event.preventDefault(); submitMessage(input) }}>
        <input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); submitMessage(input) } }} placeholder="Ask me anything..." aria-label="Message the Dream Guide" maxLength={1000} disabled={status !== "ready"} />
        <button type="submit" aria-label="Send message" disabled={!input.trim() || status !== "ready"}><ArrowUp size={16} /></button>
      </form>
      <p className="guide-disclaimer">A friendly guide to the public Never Forget to Dream universe.</p>
    </section>}
  </>
}
