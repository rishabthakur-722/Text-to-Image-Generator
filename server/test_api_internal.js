import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const prompt = 'a cute cat';
const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true`;

async function test() {
    console.log('Testing Pollinations API...');
    try {
        const response = await axios.get(pollinationsUrl, {
            responseType: 'arraybuffer',
            timeout: 15000
        });
        console.log('Pollinations Success! Response size:', response.data.byteLength);
    } catch (error) {
        console.error('Pollinations Failed:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
        }
    }

    if (process.env.HUGGINGFACE_API_KEY) {
        console.log('Testing Hugging Face API...');
        try {
            const hfApiUrl = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1";
            const hfResponse = await axios.post(
                hfApiUrl,
                { inputs: prompt },
                {
                    headers: {
                        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                        "Content-Type": "application/json"
                    },
                    responseType: "arraybuffer",
                    timeout: 15000
                }
            );
            console.log('HF Success! Response size:', hfResponse.data.byteLength);
        } catch (error) {
            console.error('HF Failed:', error.message);
            if (error.response) {
                console.error('Status:', error.response.status);
            }
        }
    } else {
        console.log('Skipping HF test (no key).');
    }
}

test();
