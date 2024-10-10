export default interface ticket {
  id: number;
  ramal: string;
  requesterAvatar: string;
  request_type: string;
  message: string;
  priority: string;
  department: string;
  user_name: string;
  created_at: string;
  image: string;
  email: string;
  status: string;
  assignee: string;
  time_conclusion: string | null;
}
