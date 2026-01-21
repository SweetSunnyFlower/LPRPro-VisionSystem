export interface PlateRecord {
  id: string;
  plateNumber: string;
  timestamp: Date;
  confidence?: number;
  imageUrl?: string; // Optional thumbnail
}

export enum AppStatus {
  IDLE = 'IDLE',
  SCANNING = 'SCANNING',
  PROCESSING = 'PROCESSING',
  ERROR = 'ERROR',
}

export interface RecognitionResponse {
  plate: string | null;
}
