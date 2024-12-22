from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import GoogleGenerativeAI


def generate_summary(context: str) -> str:
    messages = [
        ("system", "Write a concise summary of the following notes:\\n\\n{context}"),
    ]

    prompt_template = ChatPromptTemplate(messages)
    prompt = prompt_template.invoke({"context": context})

    model = GoogleGenerativeAI(
        model="gemini-exp-1206",
    )
    result = model.invoke(prompt)

    return result
