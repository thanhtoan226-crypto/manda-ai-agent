from langgraph.graph import StateGraph, MessagesState, START, END


def build_agent_graph():
    """Build the core LangGraph agent graph for Manda."""
    graph = StateGraph(MessagesState)

    # TODO: add nodes and edges
    # graph.add_node("agent", agent_node)
    # graph.add_node("tools", tool_node)
    # graph.add_edge(START, "agent")
    # graph.add_conditional_edges("agent", should_continue, {"continue": "tools", "end": END})
    # graph.add_edge("tools", "agent")

    return graph.compile()
