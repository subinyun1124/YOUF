import axios from 'axios';
import { AuthResult } from './types';
import { Platform } from 'react-native';

const url =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8081'
    : 'http://localhost:8081';
// const url = 'http://3.36.247.178:8081';

interface registerParams {
  userId: string;
  email: string;
  password: string;
  fullname: string;
}
export const register = async (params: registerParams) => {
  const response = await axios.post<AuthResult>(
    url + '/api/join',
    params,
  );
  return response.data.data;
};


interface loginParams {
  userId: string;
  password: string;
}
export const login = async (params: loginParams) => {
  const response = await axios.post<AuthResult>(
    url + '/api/login',
    params,
  );
  return response.data.data;
};


// 전체 BaseAI 리스트 가져오기
export const baseAIList = async (userToken:string) => {
  try {
    const response = await axios.get(
      url + '/api/auth/ai/base/all',
      {
        headers: {
          Authorization: userToken,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    return [];
  }
};


// 전체 CustomAI 리스트 가져오기
export const customAIList = async (userToken:string, creator:string, active:string, hidden:string) => {
  try {
    const response = await axios.get(
      url + '/api/auth/ai/custom/all',
      {
        headers: {
          Authorization: userToken,
        },
        params: {
          creator,
          active,
          hidden,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    return [];
  }
};


// AI 구독하기
interface AISubcriptionParams {
  userId: string;
  customAiId: string;
}
export const AISubcription = async (params: AISubcriptionParams, userToken: string) => {
  const response = await axios.post<AuthResult>(
    url + '/api/auth/aisubsciption/subscribe',
    params,
    {
      headers: {
        Authorization: userToken,
      },
    }
  );
  return response.data;
};


// YOUF 구독 해지
export const AIUnSubcription = async (aiSubscriptionId: string, userToken: string) => {
  const response = await axios.delete<AuthResult>(
    url + '/api/auth/aisubsciption/delete/' + aiSubscriptionId ,
    {
      headers: {
        Authorization: userToken,
      },
    }
  );
  return response.data;
};


// 유저 별 구독 내역 가져오기
export const userAISubscription = async (userId: string, userToken: string) => {
  try {
    const response = await axios.get(
      url + '/api/auth/aisubsciption/relation/' + userId,
      {
        headers: {
          Authorization: userToken,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    return [];
  }
};


// 유저 별 구독 채팅방 대화 내용 가져오기
export const userAISubscriptionChat = async (AiId:string, userToken:string) => {
  try {
    const response = await axios.get(
      url + '/api/auth/messages/' + AiId + '/page',
      {
        headers: {
          Authorization: userToken,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.log('error: ' + error);
    return [];
  }
};


// 유저 별 구독한 AI 들의 마지막 채팅 가져오기
export const userAISubscriptionLastChat = async (userId: string, userToken: string) => {
  try {
    const response = await axios.get(
      url + '/api/auth/messages/latest/AI/' + userId,
      {
        headers: {
          Authorization: userToken,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.log('error: ' + error);
    return [];
  }
};


// YOUF 생성
interface createAssistantParams {
  userId: string;
  userToken: string;
  name: string;
  description: string;
  baseAiId: string;
  customPrompt: string;
  imageUrl: string | null;
  hidden: boolean;
}
export const createAssistant = async (params: createAssistantParams) => {
  const formData = new FormData();
  const jsonData = {
    userId: params.userId,
    name: params.name,
    description: params.description,
    baseAiId: params.baseAiId,
    customPrompt: params.customPrompt,
    aiProvider: 'Gemini3',
    active: true,
    hidden: params.hidden,
  };

  formData.append('jsonData', JSON.stringify(jsonData));

  if (params.imageUrl) {
    formData.append('image', {
      uri: params.imageUrl,
      name: 'photo.jpg',
      type: 'image/jpeg',
    } as any);
  }

  try {
    const response = await axios.post(
      url + '/api/auth/ai/custom/create',
      formData,
      {
         headers: {
          'Authorization': params.userToken,
          'Content-Type': 'multipart/form-data',
         },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.log('에러:', error);
  }
};


// YOUF 상세정보 수정
interface UpdateAssistantParams {
  userId: string;
  userToken: string;
  id: string;
  name: string;
  description: string;
  baseAiId: string;
  customPrompt: string;
  imageUrl: string | null;
  active: boolean;
  hidden: boolean;
  approved: boolean;
}
export const updateAssistant = async (params: UpdateAssistantParams) => {
  const formData = new FormData();

  const jsonData = {
    userId: params.userId,
    id: params.id,
    name: params.name,
    description: params.description,
    baseAiId: 2,
    customPrompt: params.customPrompt,
    active: true,
    hidden: params.hidden,
    approved: params.approved,
  };

  formData.append('jsonData', JSON.stringify(jsonData));

  if (params.imageUrl) {
    formData.append('image', {
      uri: params.imageUrl,
      name: 'photo.jpg',
      type: 'image/jpeg',
    } as any);
  }
  try {
    const response = await axios.put(
      url + '/api/auth/ai/custom/update',
      formData,
      {
         headers: {
          'Authorization': params.userToken,
          'Content-Type': 'multipart/form-data',
         },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.log('에러:', error);
  }
};


// 유저 별 구독한 AI 들의 스케줄 가져오기
export const userAISubscriptionScheduler = async (userId: string, userToken: string, aiSubscriptionId: string) => {
  try {
    const response = await axios.get(
      url + '/api/auth/schedule/job?userId=' + userId,
       {
        headers: {
          Authorization: userToken,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.log('error: ' + error);
    return [];
  }
};


// 쿼츠 스케줄 상태 변경
interface qurtzScheduler {
  jobName: string,
  jobGroup: string,
  jobClass:string,
  cronExpression: string,
  description : string,
  jobType : string,
  jobData: {
      prompt: string,
      senderName: string,
      subscriptionId: string
  },
  status: string,
  userId: string
}
export const qurtzSchedule = async (params: qurtzScheduler, userToken: string) => {
  
    // "jobName": "America Stock Expert(테슬라)1",
    // "jobGroup":"SendMessageAI",
    // "jobClass":"com.uf.assistance.batchjob.DynamicQuartzJob",
    // "cronExpression":"00 00 09 * * ?",    
    // "description" : "미국주식 정기배치잡(테슬라)",
    // "jobType" : "SendMessageAI",
    // "jobData": { 
    //     "prompt": "너는 숙련된 미국 주식 애널리스트이며, 투자자에게 유용한 정보를 제공하는 것이 목적이다. 다음 항목들을 바탕으로 사용자가 물어보는 미국 주식 종목에 대해 요약 분석해줘: 기업 개요, 최근 실적, 주요 뉴스, 주가 차트 흐름, 경쟁사 비교, 향후 투자 리스크. 초보자도 이해할 수 있도록 쉽게 설명해줘, 애플 주식에 대해서 자세히설명해줘, 종목은 테슬라 로 해줘",
    //     "senderName": "GPT",
    //     "subscriptionId": "19"
    // },
    // "status":"ENABLED",
    // "userId":"John"

  const response = await axios.post<AuthResult>(
    url + '/api/auth/schedule/create',
    params,
    {
      headers: {
        Authorization: userToken,
      },
    }
  );
  return response.data.data;
};
