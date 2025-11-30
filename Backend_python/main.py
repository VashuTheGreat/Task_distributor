from pydantic import BaseModel, Field
from langgraph.graph import StateGraph, START, END
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, AIMessage
import vconsoleprint
from dotenv import load_dotenv

load_dotenv()

from typing import List, Dict, Optional


class Suggestion(BaseModel):
    query:HumanMessage=Field(description="User query")
    ai_response:Optional[AIMessage]=Field(default=None, description="AI response")




class Structured_Output(BaseModel):
    title:str=Field(description="title of the project")
    description:str=Field(description="description of the project")




def get_response(state:Suggestion)->Suggestion:
    llm=ChatGroq(model="llama-3.3-70b-versatile")
    prompt=ChatPromptTemplate.from_messages([
        ("system","You are a helpful assistant that can suggest project titles and descriptions based on user queries."),
        ("user","{query}")
    ])
    llm_with_structure=llm.with_structured_output(Structured_Output)
    
    chain = prompt | llm_with_structure
    
    response = chain.invoke({"query": state.query.content})
    
    state.ai_response=response
    return state


graph=StateGraph(Suggestion)
graph.add_node("get_response",get_response)
graph.add_edge(START,"get_response")
graph.add_edge("get_response",END)



graph=graph.compile()


def response(content):
    response=graph.invoke({"query":HumanMessage(content=content)})
    response_data = {"title":response['ai_response'].title,"description":response['ai_response'].description}
    return response_data


if __name__=="__main__":
    response_data=response("I want to create a project about natural language processing")
    print(response_data)
