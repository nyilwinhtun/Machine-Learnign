import { LessonStep, LessonStepSchema } from '../schemas/mlSchemas';

/**
 * Curated 80/20 Must-Know ML Core curriculum (6 foundational pillars)
 * with bilingual English & Burmese (Unicode) explanations, real-life analogies,
 * key vocabulary, interactive chart types, and textbook/YouTube references.
 */
export const mlCoreData: LessonStep[] = [
  {
    id: 'problem-framing',
    stepNumber: 1,
    titleEn: 'Problem Framing (Supervised vs. Unsupervised)',
    titleMm: 'ပြဿနာသတ်မှတ်ခြင်း (ကြီးကြပ်သင်ယူမှု နှင့် ကြီးကြပ်မှုမဲ့သင်ယူမှု)',
    arrowSummary:
      'Business Goal → Check Labeled Data → Supervised (Regression / Classification) OR Unsupervised (Clustering)',
    analogyMm:
      'စာမေးပွဲဖြေဖို့ လေ့ကျင့်တဲ့အခါ အဖြေမှန်စာရွက် (Labels) ပါပြီးသား ပုစ္ဆာတွေနဲ့ ကျင့်တာက Supervised Learning ပါ။ အဖြေမှန်မပါဘဲ ပုံစံတူအုပ်စုလေးတွေ ကိုယ့်ဘာသာ ခွဲကြည့်တာက Unsupervised Learning ပါ။',
    vocabulary: [
      {
        term: 'Supervised Learning',
        definitionMm:
          'အဖြေမှန် (Label) ပါပြီးသား ဒေတာများကို ကြည့်၍ ခန့်မှန်းတတ်အောင် သင်ယူသည့် နည်းလမ်း။',
      },
      {
        term: 'Unsupervised Learning',
        definitionMm:
          'အဖြေမှန် (Label) မပါဘဲ ဒေတာအတွင်းရှိ ပုံစံတူအုပ်စုများ (Patterns/Clusters) ကို ရှာဖွေသည့် နည်းလမ်း။',
      },
      {
        term: 'Regression',
        definitionMm:
          'အိမ်ဈေးနှုန်း၊ အပူချိန် စသည့် ဆက်တိုက်ကိန်းဂဏန်း (Continuous Number) ကို ခန့်မှန်းခြင်း။',
      },
      {
        term: 'Classification',
        definitionMm:
          'Spam ဟုတ်/မဟုတ်၊ ရောဂါ ရှိ/မရှိ စသည့် အမျိုးအစား (Category) ခွဲခြားခြင်း။',
      },
    ],
    chartType: 'classification',
    references: {
      textbookChapter:
        'Hands-On Machine Learning (Aurélien Géron) Ch. 1: The Machine Learning Landscape; Machine Learning For Absolute Beginners (Oliver Theobald) Ch. 1 & Ch. 3; Essential Math for Data Science (Thomas Nield) Ch. 1',
      youtubeQuery: 'StatQuest Supervised vs Unsupervised Machine Learning',
    },
  },
  {
    id: 'data-preprocessing',
    stepNumber: 2,
    titleEn: 'Data Preprocessing (Missing Values, One-Hot Encoding, Feature Scaling)',
    titleMm: 'ဒေတာသန့်စင်ပြင်ဆင်ခြင်း (ကွက်လပ်ဖြည့်ခြင်း၊ ကိန်းဂဏန်းပြောင်းခြင်း နှင့် စကေးညှိခြင်း)',
    arrowSummary:
      'Raw Messy Data → Handle Missing Values → One-Hot Encode Categories → Scale Numerical Features',
    analogyMm:
      'ဟင်းမချက်ခင် ဈေးကဝယ်လာတဲ့ ဟင်းသီးဟင်းရွက်တွေကို ရေဆေး၊ အမှိုက်ဖယ်၊ အရွယ်တူ လှီးဖြတ်ရသလိုပါပဲ။ မော်ဒယ်ကို မကျွေးခင် မပြည့်စုံတဲ့ဒေတာဖြည့်၊ စာသားတွေကို ဂဏန်းပြောင်းပြီး စကေးညှိပေးရပါတယ်။',
    vocabulary: [
      {
        term: 'Imputation (Missing Values)',
        definitionMm:
          'ဒေတာကွက်လပ် (NaN) များကို ပျမ်းမျှတန်ဖိုး (Mean/Median) သို့မဟုတ် အများဆုံးတန်ဖိုးဖြင့် အစားထိုးဖြည့်စွက်ခြင်း။',
      },
      {
        term: 'One-Hot Encoding',
        definitionMm:
          'မြို့အမည်၊ အရောင် စသည့် စာသားအမျိုးအစား (Categorical) များကို 0 နှင့် 1 ကော်လံများအဖြစ် ပြောင်းလဲခြင်း။',
      },
      {
        term: 'Feature Scaling',
        definitionMm:
          'လစာ (သိန်းဂဏန်း) နှင့် အသက် (ဆယ်ဂဏန်း) ကဲ့သို့ အတိုင်းအတာမတူသော ကိန်းဂဏန်းများကို တူညီသောစကေး (ဥပမာ 0 မှ 1 သို့မဟုတ် Mean 0) သို့ ညှိခြင်း။',
      },
    ],
    chartType: 'split',
    references: {
      textbookChapter:
        'Hands-On Machine Learning (Aurélien Géron) Ch. 2: End-to-End Machine Learning Project (Prepare the Data); Machine Learning For Absolute Beginners (Oliver Theobald) Ch. 4: Data Scrubbing; Essential Math for Data Science (Thomas Nield) Ch. 3: Descriptive Statistics',
      youtubeQuery: 'Feature Scaling Normalization Standardization One Hot Encoding explained',
    },
  },
  {
    id: 'train-val-test-split',
    stepNumber: 3,
    titleEn: 'Train / Validation / Test Split & Data Leakage',
    titleMm: 'ဒေတာခွဲဝေခြင်း (Train / Validation / Test) နှင့် ဒေတာပေါက်ကြားမှု',
    arrowSummary:
      'Full Dataset → Split First (Train 70% / Val 15% / Test 15%) → Fit Scaler on Train Only → Prevent Data Leakage',
    analogyMm:
      'ကျောင်းသားတစ်ယောက်ကို ဖတ်စာအုပ် (Train) နဲ့ စာကျက်ခိုင်း၊ အစမ်းစာမေးပွဲ (Validation) နဲ့ ပြန်စစ်ပြီးမှ တကယ့်စာမေးပွဲကြီး (Test) ဖြေခိုင်းသလိုပါပဲ။ စာမေးပွဲမေးခွန်းကို ကြိုမြင်သွားရင် (Data Leakage) တကယ်တတ်မတတ် မသိနိုင်တော့ပါဘူး။',
    vocabulary: [
      {
        term: 'Training Set',
        definitionMm:
          'မော်ဒယ်က ပုံစံများ (Patterns) ကို သင်ယူရန် အသုံးပြုသည့် အဓိကဒေတာအစု။',
      },
      {
        term: 'Validation Set',
        definitionMm:
          'မော်ဒယ်၏ Hyperparameters များကို ချိန်ညှိရန်နှင့် အကောင်းဆုံးမော်ဒယ် ရွေးချယ်ရန် စမ်းသပ်သည့် ဒေတာအစု။',
      },
      {
        term: 'Test Set',
        definitionMm:
          'မော်ဒယ်အပြီးသတ်ပြီးနောက် လက်တွေ့စွမ်းဆောင်ရည်ကို တစ်ကြိမ်သာ တိုင်းတာရန် သိမ်းထားသော ဒေတာအစု။',
      },
      {
        term: 'Data Leakage',
        definitionMm:
          'Test/Validation ဒေတာမှ အချက်အလက်များ Training လုပ်ငန်းစဉ်ထဲ မတော်တဆ ဝင်ရောက်သွားပြီး ရလဒ်အတု ကောင်းနေခြင်း။',
      },
    ],
    chartType: 'split',
    references: {
      textbookChapter:
        'Hands-On Machine Learning (Aurélien Géron) Ch. 2: Create a Test Set; Machine Learning For Absolute Beginners (Oliver Theobald) Ch. 5: Setting Up Your Data; Essential Math for Data Science (Thomas Nield) Ch. 5: Linear Regression (Train/Test Splits)',
      youtubeQuery: 'Train Validation Test Split and Data Leakage Machine Learning',
    },
  },
  {
    id: 'model-training',
    stepNumber: 4,
    titleEn: 'Model Training (Linear Regression, Decision Trees, Random Forests)',
    titleMm: 'မော်ဒယ်လေ့ကျင့်ခြင်း (Linear Regression, Decision Trees, Random Forests)',
    arrowSummary:
      'Initialize Model → Feed Training Features & Labels → Minimize Loss / Split Nodes → Learned Model',
    analogyMm:
      'Linear Regression က ဒေတာအစက်လေးတွေကြား အနီးစပ်ဆုံး မျဉ်းဖြောင့်ဆွဲသလိုပါ။ Decision Tree ကတော့ မေးခွန်းတွေ (ဥပမာ- အသက် ၃၀ ကျော်လား?) အဆင့်ဆင့်မေးပြီး ဆုံးဖြတ်တာဖြစ်ပြီး Random Forest ကတော့ သစ်ပင်ပေါင်းများစွာရဲ့ အမြင်ကို စုပေါင်းမဲပေးဆုံးဖြတ်တာပါ။',
    vocabulary: [
      {
        term: 'Linear Regression',
        definitionMm:
          'သွင်းအားစု (Features) နှင့် ရလဒ် (Target) ကြား ဆက်နွယ်မှုကို မျဉ်းဖြောင့်ညီမျှခြင်းဖြင့် ခန့်မှန်းသည့် မော်ဒယ်။',
      },
      {
        term: 'Decision Tree',
        definitionMm:
          'If-Else မေးခွန်းများကို သစ်ပင်ပုံစံ အဆင့်ဆင့်ခွဲ၍ ဆုံးဖြတ်ချက်ချသည့် မော်ဒယ်။',
      },
      {
        term: 'Random Forest',
        definitionMm:
          'Decision Tree အများအပြားကို စုပေါင်းတည်ဆောက်ပြီး အများစုသဘောတူညီချက်ဖြင့် ပိုမိုတိကျစွာ ခန့်မှန်းသည့် Ensemble မော်ဒယ်။',
      },
    ],
    chartType: 'regression',
    references: {
      textbookChapter:
        'Hands-On Machine Learning (Aurélien Géron) Ch. 4, Ch. 6 & Ch. 7 (Training Models, Decision Trees, Random Forests); Machine Learning For Absolute Beginners (Oliver Theobald) Ch. 6, Ch. 9 & Ch. 10; Essential Math for Data Science (Thomas Nield) Ch. 5',
      youtubeQuery: 'StatQuest Linear Regression Decision Trees Random Forests',
    },
  },
  {
    id: 'overfitting-underfitting',
    stepNumber: 5,
    titleEn: 'Overfitting vs. Underfitting (Bias-Variance Tradeoff & Regularization)',
    titleMm: 'အလွတ်ကျက်မိခြင်း (Overfitting) နှင့် မလေ့လာမိခြင်း (Underfitting)',
    arrowSummary:
      'High Bias (Underfit) → Balanced Fit (Sweet Spot) ← High Variance (Overfit) → Apply Regularization',
    analogyMm:
      'Underfitting ဆိုတာ စာမကျက်ဘဲ စာမေးပွဲဝင်ဖြေသလို အခြေခံတောင် မသိတာပါ။ Overfitting ဆိုတာကတော့ လေ့ကျင့်ခန်းပုစ္ဆာတွေကို နားမလည်ဘဲ အလွတ်ကျက်သွားလို့ မေးခွန်းနည်းနည်းပြောင်းလိုက်တာနဲ့ မဖြေနိုင်တော့တာပါ။',
    vocabulary: [
      {
        term: 'Underfitting (High Bias)',
        definitionMm:
          'မော်ဒယ်က ရိုးရှင်းလွန်းသဖြင့် Training ဒေတာထဲက ပုံစံကိုပင် ကောင်းစွာ မသင်ယူနိုင်ခြင်း။',
      },
      {
        term: 'Overfitting (High Variance)',
        definitionMm:
          'မော်ဒယ်က Training ဒေတာရှိ ဆူညံသံ (Noise) များအထိ အလွတ်ကျက်မိသဖြင့် ဒေတာအသစ်တွင် မှားယွင်းခြင်း။',
      },
      {
        term: 'Regularization (L1 / L2)',
        definitionMm:
          'မော်ဒယ်၏ Weights များ အလွန်အမင်းကြီးမားမသွားစေရန် Penalty ထည့်၍ Overfitting ကို ထိန်းချုပ်သည့် နည်းလမ်း။',
      },
    ],
    chartType: 'overfitting',
    references: {
      textbookChapter:
        'Hands-On Machine Learning (Aurélien Géron) Ch. 4: Regularized Linear Models & Learning Curves; Machine Learning For Absolute Beginners (Oliver Theobald) Ch. 5: Bias-Variance Tradeoff; Essential Math for Data Science (Thomas Nield) Ch. 5 & Ch. 6',
      youtubeQuery: 'StatQuest Bias and Variance Overfitting Underfitting Regularization',
    },
  },
  {
    id: 'evaluation-metrics',
    stepNumber: 6,
    titleEn: 'Evaluation Metrics (RMSE, Confusion Matrix, Precision & Recall)',
    titleMm: 'စွမ်းဆောင်ရည်တိုင်းတာခြင်း (RMSE, Confusion Matrix, Precision နှင့် Recall)',
    arrowSummary:
      'Predict on Test Set → Regression? Use RMSE/MAE → Classification? Use Confusion Matrix, Precision & Recall',
    analogyMm:
      'Accuracy တစ်ခုတည်းကြည့်ရင် လှည့်စားခံရနိုင်ပါတယ်။ ဥပမာ- ကင်ဆာရောဂါရှာရာမှာ လူနာအမှန်ကို မလွတ်သွားဖို့ (Recall) က အရေးကြီးသလို၊ Spam စစ်ရာမှာတော့ အရေးကြီးအီးမေးလ်ကို Spam ထဲ မှားမထည့်မိဖို့ (Precision) က ပိုအရေးကြီးပါတယ်။',
    vocabulary: [
      {
        term: 'RMSE (Root Mean Squared Error)',
        definitionMm:
          'Regression မော်ဒယ်များတွင် ခန့်မှန်းတန်ဖိုးနှင့် တကယ့်တန်ဖိုးကြား ပျမ်းမျှကွာဟချက် (နည်းလေ ကောင်းလေ)။',
      },
      {
        term: 'Confusion Matrix',
        definitionMm:
          'Classification ရလဒ်များ (True Positive, False Positive, True Negative, False Negative) ကို ဇယားဖြင့် ဖော်ပြခြင်း။',
      },
      {
        term: 'Precision',
        definitionMm:
          'Positive ဟု ခန့်မှန်းလိုက်သည့်အထဲမှ တကယ်မှန်ကန်သည့် ရာခိုင်နှုန်း (False Alarm နည်းစေရန်)။',
      },
      {
        term: 'Recall',
        definitionMm:
          'တကယ်ရှိနေသော Positive အားလုံးထဲမှ မော်ဒယ်က ရှာဖွေမိသည့် ရာခိုင်နှုန်း (လွတ်မသွားစေရန်)။',
      },
    ],
    chartType: 'classification',
    references: {
      textbookChapter:
        'Hands-On Machine Learning (Aurélien Géron) Ch. 2 (Performance Measures: RMSE) & Ch. 3 (Classification: Confusion Matrix, Precision/Recall); Machine Learning For Absolute Beginners (Oliver Theobald) Ch. 11; Essential Math for Data Science (Thomas Nield) Ch. 6: Logistic Regression & Confusion Matrices',
      youtubeQuery: 'StatQuest Confusion Matrix Precision Recall F1 Score RMSE',
    },
  },
];

// Validate curated data at module load in development/tests if desired
export function validateMlCoreData(): LessonStep[] {
  return mlCoreData.map((lesson) => LessonStepSchema.parse(lesson));
}
