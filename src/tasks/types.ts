export interface ArticleListResponse {
  return_code: number;
  return_message: string;
  context: Context;
  extension: null;
}

export interface ArticleInfoResponse {
  return_code: number;
  return_message: string;
  context: ArticleInfo;
  extension: null;
}

interface ArticleInfo {
  cafe_key: string;
  channel_key: string;
  channel_no: null;
  board_name: string;
  card_no: string;
  community_no: number;
  user: User;
  title: string;
  subtitle: string;
  content: string;
  tag_list: any[];
  reply_yn: string;
  reply_cnt: number;
  claim_cnt: number;
  share_cnt: number;
  read_cnt: number;
  like_cnt: number;
  liked: boolean;
  dislike_cnt: number;
  disliked: null;
  enable_share: boolean;
  reg_dt: string;
  card_function_type: string;
  write_type: string;
  media_type: string;
  media_url: string;
  media_cnt: number;
  leader_media_no: number;
  headline_name: null;
  preview_url: string;
  preview_service_type: string;
  mine: boolean;
  mobile_thumb_url: null;
  img_width: string;
  img_height: string;
  poll_list: null;
  poll_nos: null;
  master_origin_info: null;
  need_redirect: boolean;
  next_card_info: null;
  previous_card_info: null;
  attached_file_id: null;
  card_type: string;
  parent_card_no: null;
  public_yn: string;
  scrap_permission_yn: string;
  active_yn: null;
  grade_avg: null;
  grade_cnt: null;
  referred_cnt: number;
  sub_card_cnt: null;
  sub_card_user_cnt: null;
  ugc_id: null;
  ugc_meta: null;
  ugc_version_list: null;
  status: string;
  status_reserved: null;
  meta_content: null;
  recommend_reg_dt: null;
  headline_no: null;
  overview_url: null;
  last_upd_dt: null;
  view_mode: string;
  last_read_dt: number;
  notice_event_yn: string;
  event_yn: string;
  event_start_dt: null;
  event_end_dt: null;
  publish_reservation_yn: string;
  reservation_start_dt: null;
  card_reservation: null;
  overview_id: string;
  learning_data_yn: string;
  pick_reg_dt: null;
  rec_yn: string;
  notice_cancel_reservation: null;
  notice_pick_reg_dt: null;
}

interface Article {
  card_no: string;
  channel_no: number;
  user: User;
  profile_img: null;
  title: string;
  subtitle: string;
  content: string;
  tag_list: any[];
  article_tag_info: ArticleTagInfo;
  reply_yn: string;
  reply_cnt: number;
  claim_cnt: number;
  share_cnt: number;
  read_cnt: number;
  like_cnt: number;
  liked: boolean;
  dislike_cnt: number;
  disliked: null;
  reg_dt: string;
  community_no: number;
  enable_share: null;
  view_more_flag: boolean;
  mine: boolean;
  media_type: MediaType;
  media_url: string;
  preview_service_type: ServiceType;
  preview_url: string;
  mobile_thumb_url: null;
  img_width: string;
  img_height: string;
  write_type: string;
  card_function_type: string;
  media_cnt: number;
  media_list: MediaList[];
  poll_list: null;
  poll_nos: null;
  reply: null;
  attached_file_id: null;
  headline_name: string;
  head_attach: boolean;
  card_type: string;
  public_yn: string;
  scrap_permission_yn: string;
  referred_cnt: number;
  sub_card_cnt: null;
  sub_card_user_cnt: null;
  last_upd_dt: null;
  grade_avg: null;
  grade_cnt: null;
  ugc_meta: null;
  meta_content: null;
  ugc_id: null;
  ugc_type: null;
  status: string;
  status_reserved: null;
  device_type: string;
  overview_url: null | string;
  last_reply_user: User;
  last_reply_dt: null | string;
  active_yn: null;
  progress_encoding: boolean;
  view_mode: string;
  notice_event_yn: string;
  event_yn: string;
  event_start_dt: null;
  event_end_dt: null;
  publish_reservation_yn: string;
  pick_reg_dt: null;
  rec_yn: string;
  notice_pick_reg_dt: null;
}

interface Context {
  board_name: string;
  board_type: number;
  list_type: number;
  paging_type: number;
  total_count: number;
  article_list: Article[];
}

interface ArticleTagInfo {
  channel_tag: any[];
  menu_tag: any[];
  attribute_tag: any[];
  user_tag: null;
  hash_tag: any[];
  head_tag: string[];
  custom_tag_list: CustomTagList;
}

interface CustomTagList {
  channel_tag: string[];
  menu_tag: any[];
  attribute_tag: any[];
  group_tag: any[];
}

interface User {
  member_no: number;
  login_provider_cd: null | string;
  nickname: Nickname | null;
  cp_nickname: null;
  profile_img: null | string;
  badge_img: null;
  member_type: null;
  cp_home_nickname_flag: null | string;
  cp_home_game_nickname: null | string;
  cp_home_game_profile_img: null | string;
  cp_home_game_level: null;
  cp_home_game_exp: null;
  cp_home_game_grade: null;
  grade_name: GradeName;
  grade_rank: number;
  user_grade: null | string;
  liking: null;
  score: null;
  ranking: null;
  cumulative_count: null;
}

enum GradeName {
  Official = "Official",
  브론즈 = "브론즈",
}

enum Nickname {
  AshramBadja = "AshramBadja",
  GMBaal = "GM Baal",
  Stove171283467 = "STOVE171283467",
}

interface MediaList {
  media_no: number;
  media_type: MediaType;
  service_type: ServiceType;
  preview_url: string;
  media_url: string;
  reg_type: RegType;
}

enum MediaType {
  Image = "IMAGE",
}

enum RegType {
  User = "USER",
}

enum ServiceType {
  Dynocaps = "DYNOCAPS",
}
