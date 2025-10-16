// Описываете свои инструменты для OpenAI
const tools = [
    {
      type: "function",
      function: {
        name: "search_crm",
        description: "Поиск клиента в CRM",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string" }
          }
        }
      }
    },
    {
      type: "function", 
      function: {
        name: "create_db_record",
        description: "Создать запись в базе данных",
        parameters: {
          // ... параметры
        }
      }
    },
    {
      type: "function",
      function: {
        name: "get_appointment",
        description: "Получить запись о приеме",
      }
    }
  ];

  export default tools;