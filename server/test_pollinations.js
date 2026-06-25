import axios from "axios";

async function test() {
  try {
    const prompt = 'cat';
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true&seed=12345`;
    const { data } = await axios.get(pollinationsUrl, {
      responseType: 'arraybuffer',
      timeout: 60000
    });
    console.log("OK", data.length);
  } catch (err) {
    console.error("ERR", err.message);
  }
}
test();
