import { AuthResult } from './types';
import {api} from './api';

interface registerParams {
  userId: string;
  email: string;
  password: string;
  username: string;
}
export const register = async (params: registerParams) => {
  const response = await api.post<AuthResult>(
    '/api/auth/join',
    params,
  );
  return response.data.data;
};


interface loginParams {
  userId: string;
  password: string;
}
export const login = async (params: loginParams) => {
  const response = await api.post<AuthResult>(
    '/api/auth/login',
    params,
  );
  return response.data.data;
};


// 아이디 중복 체크
export const checkUserId = async (userId:string) => {
  const response = await api.get(
  '/api/auth/check/' + userId
  );
  return response.data.data;
};


// 전체 BaseAI 리스트 가져오기
export const baseAIList = async () => {
  const response = await api.get('/api/auth/ai/base/all');
  return response.data.data;
};


// 전체 CustomAI 리스트 가져오기
export const customAIList = async (creator:string, active:string, hidden:string) => {
  const response = await api.get(
    '/api/auth/ai/custom/all',
    {
      params: {
        creator,
        active,
        hidden,
      },
    }
  );
  return response.data.data;
};


// AI 구독하기
interface AISubcriptionParams {
  id: number;
  customAiId: string;
}
export const AISubcription = async (params: AISubcriptionParams) => {
  const response = await api.post<AuthResult>(
    '/api/auth/aisubscription/subscribe',
    params
  );
  return response.data;
};


// YOUF 구독 해지
export const AIUnSubcription = async (aiSubscriptionId: string) => {
  const response = await api.delete<AuthResult>('/api/auth/aisubscription/delete/' + aiSubscriptionId);
  return response.data;
};


// 유저 별 구독 내역 가져오기
export const userAISubscription = async (id: number) => {
  const response = await api.get(
    '/api/auth/aisubscription/relation/' + id
  );
  return response.data.data;
};


// 유저 별 구독 채팅방 대화 내용 가져오기
export const userAISubscriptionChat = async (AiId:string) => {
  const response = await api.get(
    '/api/auth/messages/' + AiId + '/page'
  );
  return response.data.data;
};


// 유저 별 구독한 AI 들의 마지막 채팅 가져오기
export const userAISubscriptionLastChat = async (id: number) => {
  const response = await api.get(
    '/api/auth/messages/latest/AI/' + id
  );
  return response.data.data;
};


// YOUF 생성
interface createAssistantParams {
  id: number;
  // userToken: string;
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
    userId: params.id,
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

  const response = await api.post(
    '/api/auth/ai/custom/create',
    formData,
    {
       headers: {
        // 'Authorization': params.userToken,
        'Content-Type': 'multipart/form-data',
       },
    }
  );
  return response.data.data;
};


// YOUF 상세정보 수정
interface UpdateAssistantParams {
  user_id: number;
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
    user_id: params.user_id,
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
  const response = await api.put(
    '/api/auth/ai/custom/update',
    formData,
    {
       headers: {
        'Content-Type': 'multipart/form-data',
       },
    }
  );
  return response.data.data;
};


// 유저 별 구독한 AI 들의 스케줄 가져오기
export const userAISubscriptionScheduler = async (id: number) => {
  const response = await api.get(
    '/api/auth/schedule/job?userId=' + id
  );
  return response.data.data;
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
  userId: number
}
export const qurtzSchedule = async (params: qurtzScheduler) => {
  
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

  const response = await api.post<AuthResult>(
    '/api/auth/schedule/create',
    params
  );
  return response.data.data;
};
