export interface Attendee {
  id: string;
  name: string;
  email: string;
  type: "required" | "optional";
  status: "accepted" | "tentative" | "declined" | "no_response";
}

export interface Meeting {
  id: string;
  title: string;
  description: string | null;
  organiser: string;
  attendees: Attendee[];
  start_time: string;
  end_time: string;
  location: string | null;
  category_color: string;
  is_manda_created: boolean;
  created_at: string;
  updated_at: string;
}

export interface MeetingListResponse {
  meetings: Meeting[];
  total: number;
}

export interface MeetingCreateRequest {
  title: string;
  description?: string | null;
  organiser: string;
  attendees: Attendee[];
  start_time: string;
  end_time: string;
  location?: string | null;
  category_color: string;
  is_manda_created: boolean;
}

export interface MandaMeetingSettings {
  id: string;
  auto_color: string;
  personality: "formal" | "casual" | "corporate" | "friendly" | "direct";
  context_prompt: string;
  enabled_templates: string[];
  company_branding_enabled: boolean;
  brand_color: string | null;
  brand_header_text: string | null;
  brand_footer_text: string | null;
  safety_checks: string[];
}

export interface MandaMeetingSettingsUpdate {
  auto_color?: string;
  personality?: "formal" | "casual" | "corporate" | "friendly" | "direct";
  context_prompt?: string;
  enabled_templates?: string[];
  company_branding_enabled?: boolean;
  brand_color?: string | null;
  brand_header_text?: string | null;
  brand_footer_text?: string | null;
  safety_checks?: string[];
}

export interface MeetingTemplate {
  id: string;
  name: string;
  content: string;
  is_builtin: boolean;
  user_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface GenerateDescriptionRequest {
  prompt: string;
  generate_purpose: boolean;
  generate_outcomes: boolean;
  generate_agenda: boolean;
  personality: "formal" | "casual" | "corporate" | "friendly" | "direct";
  context_prompt: string;
  template?: string | null;
}

export interface RewriteDescriptionRequest {
  current_description: string;
  prompt: string;
  personality: "formal" | "casual" | "corporate" | "friendly" | "direct";
  context_prompt: string;
}
