import { Injectable, OnModuleInit } from "@nestjs/common";
import { systemPrompt } from "../constants/system.prompt";
import OpenAI from "openai";
import { ChatMsg } from "../interface/chat.interface";
import tools from "../tools/tools";
import { LlmResponseDto } from "../dto/llm-response.dto";

@Injectable()
export class ProccesorService implements OnModuleInit{

    private readonly openai: OpenAI;
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    onModuleInit() {
        console.log('ProccesorService initialized');
        //this.sendMessage([{ role: 'user', content: 'привет как меня зовут?' }]);
        console.log('Message sent');
    }

    private async searchCrm(args: any) {
        console.log(arguments);
        return 'searchCrm';
    }
    private async createDbRecord(args: any) {
        console.log(arguments);
        return 'createDbRecord';
    }
    private async getAppointment(args: any) {
        console.log(arguments);
        return 'getAppointment';
    }

    async sendMessage(messages: ChatMsg[]) {
        const messagesReq = [{ role: 'system', content: systemPrompt }, ...messages];
        const response = await this.openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messagesReq as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
            tools: tools as OpenAI.Chat.Completions.ChatCompletionTool[],
            tool_choice: "auto"
        }) as LlmResponseDto;
        
        if(response.choices[0].message.tool_calls) {
            switch(response.choices[0].message.tool_calls[0].function.name) {
                case "search_crm":
                    return await this.searchCrm(response.choices[0].message.tool_calls[0].function.arguments);
                case "create_db_record":
                    return await this.createDbRecord(response.choices[0].message.tool_calls[0].function.arguments);
                case "get_appointment":
                    return await this.getAppointment(response.choices[0].message.tool_calls[0].function.arguments);
            }
        }

        return response.choices[0].message.content;
    }
}