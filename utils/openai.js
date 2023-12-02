const { OpenAI } = require("openai")

//configure openai
const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
})

// const completionNDA = async (prompt) => {
//   try {
//     const completion = await openai.chat.completions.create({
//       messages: [{ role: "user", content: prompt }],
//       model: "gpt-3.5-turbo",
//     })

//     return completion

//     // const parsableJson = completion.choices[0].text
//     // return (jsonResponse = JSON.parse(parsableJson))
//   } catch (error) {
//     if (error.completion) {
//       console.log(error.completion.status)
//       console.log(error.completion.data)
//     } else {
//       console.log(error.message)
//     }
//   }
// }

const completionNDA = async (prompt) => {
  try {
    const completion = await openai.completions.create({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 3048,
      temperature: 1,
    })

    // // const parsableJson = completion.choices[0].text
    // return (jsonResponse = JSON.parse(parsableJson))
    return completion.choices[0].text
  } catch (error) {
    if (error.completion) {
      console.log(error.completion.status)
      console.log(error.completion.data)
    } else {
      console.log(error.message)
    }
  }
}

module.exports = { completionNDA }
