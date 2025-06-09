import { NextResponse } from 'next/server';
import OpenAI from "openai";


const openRouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || "",
  baseURL: "https://openrouter.ai/api/v1",
});


export async function POST(request: Request) {
  try {

    const { message, history } = await request.json();
    
    const model =  "deepseek/deepseek-r1-distill-llama-70b:free";
    
    const prompt = `
    Your model is ${model}
    You are a helpful assistant for the HCT Survival Prediction Tool. 
    Use the following context to answer the user's question:
    
    Context:
        ${history.map((msg: { role: string; content: string }) => {
            return `${msg.role}: ${msg.content}`;
        }).join("\n")}

    Transplantasi Sel Punca Hematopoietik Alogenik (HCT Alogenik) merupakan prosedur medis yang kompleks dan transformatif. Pasien menerima sel punca atau sel induk yang bertanggung jawab untuk membentuk semua jenis sel darah yang sehat dari pendonor yang cocok secara genetik, tetapi tidak identik. 
    Sel-sel donor ini menggantikan sel punca hematopoietik pasien yang seringkali sakit atau telah sengaja diablasi melalui terapi conditioning (kemoterapi). Tujuan utama HCT Alogenik adalah untuk mengobati keganasan hematologi, sindrom kegagalan sumsum tulang, dan gangguan sistem imun. 
    Metode ini dipertimbangkan ketika kemoterapi tidak memberikan respons yang memadai atau ketika kondisi yang mendasari mengalami relaps. Sumber sel punca dapat berasal dari Peripheral Blood Stem Cells (PBSCs), sumsum tulang (Bone Marrow, BM), atau darah tali pusat (Umbilical Cord Blood, UCB). 
    Keberagaman penyakit yang diobati dan variasi sumber donor menimbulkan heterogenitas signifikan dalam populasi pasien sehingga hal ini menjadi tantangan tersendiri dalam memprediksi hasil pasien secara akurat.
    Secara tradisional, analisis survival dalam konteks medis mengandalkan metode statistik klasik seperti analisis Kaplan-Meier dan model regresi Cox. Namun, metode ini memiliki keterbatasan dalam menangani data multidimensional dengan interaksi kompleks antar variabel.

	  Berdasarkan analisis data dari Center for International Blood and Marrow Transplant Research (CIBMTR), terdapat segmentasi yang jelas dan signifikan dalam probabilitas bertahan antar berbagai kelompok ras. Pasien yang diidentifikasi memiliki lebih dari satu ras menunjukkan tingkat kelangsungan hidup tertinggi, yaitu sekitar 53%. 
    Kelompok pasien dari ras "Asian" mengikuti dengan probabilitas survival tertinggi kedua, sekitar 47%. Sementara itu, kelompok minoritas dari ras lainnya, termasuk “American Indian/Alaska Native”, “Black/African-American”, dan “Native Hawaiian/Pacific Islander”, menunjukkan tingkat survival yang berkelompok di posisi tengah, yaitu sekitar 45%. 
    Yang paling menonjol, pasien dari kelompok kulit putih/ "White" menunjukkan probabilitas survival jangka panjang terendah, hanya sekitar 38%. Hasil mengenai disparitas rasial ini diperkuat lebih lanjut oleh analisis kurva Cumulative Hazard yang secara konsisten menunjukkan bahwa pasien "White" memiliki nilai hazard tertinggi, selaras dengan probabilitas bertahan mereka yang lebih rendah dibandingkan kelompok ras lainnya.

    Metrik evaluasi utama dalam penelitian ini adalah concordance index (C-index), C-index adalah metrik evaluasi yang mengukur kemampuan algoritma dalam memprediksi urutan kejadian, bukan akurasi nilai prediksi itu sendiri. C-index didefinisikan sebagai proporsi pasangan konkordan dibagi dengan total jumlah pasangan evaluasi yang mungkin. Interval nilai C-index berkisar antara 0 hingga 1. 
    Nilai 0,5 menunjukkan performa model yang setara dengan prediksi acak dan nilai maksimum 1 menandakan prediksi sempurna yang mengindikasikan bahwa model mampu mengurutkan semua kejadian dengan benar sesuai dengan urutan waktu kejadian yang sebenarnya. Untuk menganalisis aspek kesetaraan ras, beberapa pendekatan diterapkan. Pertama, kurva Kaplan-Meier diplot secara terpisah untuk setiap kelompok ras untuk memvisualisasikan perbedaan dalam Event-Free Survival (EFS). 
    Selanjutnya, C-index dihitung secara individual untuk masing-masing kelompok ras. Sebagai langkah akhir untuk mengintegrasikan akurasi dan kesetaraan, skor C-index akhir disesuaikan menggunakan penalti varians terhadap ras. Penalti ini diterapkan untuk mengurangi skor C-index jika terdapat disparitas signifikan dalam akurasi prediksi antar kelompok ras sehingga mendorong model untuk memberikan prediksi yang lebih adil dan setara.

    Analisis faktor yang paling berpengaruh terhadap prediksi event-free survival (EFS) mengidentifikasi Refined disease risk index, intensitas conditioning, skor komorbiditas, dan usia (pasien dan donor), serta tahun transplantasi sebagai prediktor utama yang konsisten pada model yang digunakan untuk penelitian ini (XGBoost, Catboots, dan LightGBM) dengan LightGBM memperoleh average score C-index tertinggi dibandingkan model lainnya.
    Disparitas kelangsungan hidup antar kelompok ras terbukti signifikan dengan pasien berkulit putih menunjukkan probabilitas kelangsungan hidup terendah dibandingkan kelompok lain. Dampak terhadap kesetaraan dalam prognosis medis diukur melalui varians C-index antar ras. Perbedaan kinerja model di seluruh kelompok ras mengindikasikan adanya kemungkinan bias dalam prediksi. 
    Penerapan C-index yang disesuaikan sebagai metrik evaluasi memungkinkan  identifikasi model yang tidak hanya akurat, tetapi juga berkeadilan/tidak bias terhadap kelompok tertentu. Hal ini memastikan bahwa prediksi medis tidak dipengaruhi oleh bias rasial yang dapat merugikan kelompok tertentu dalam pengambilan keputusan klinis.


    Question: ${message}

    Answer:`
    
    // Get response from OpenRouter 
    const completion = await openRouter.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_tokens: 1000,
    });
    
    const response = completion.choices[0]?.message?.content || 
      "Sorry, I couldn't generate a response.";
    
    return NextResponse.json({
      response
    });
    
  } catch (error: Error | unknown) {
    console.error("Error in chat API:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to process chat request";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

