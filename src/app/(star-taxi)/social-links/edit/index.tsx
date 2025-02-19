import React from "react";
import EditSocialLinks from "./social-edit";

export default function PageSocialLinks({ data, onSuccess }: { data: any; onSuccess?: () => void }) {
  return <EditSocialLinks data={data} onSuccess={onSuccess} />;
}
