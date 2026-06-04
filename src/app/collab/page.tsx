import { redirect } from "next/navigation";

const porslineSurveyUrl = "https://survey.porsline.ir/s/XuWiZEMV";

export default function CollabPage() {
  redirect(porslineSurveyUrl);
}
