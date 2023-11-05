"use client";

import useOrigin from "@/hooks/useOrigin";
import { useParams } from "next/navigation";
import ApiAlert from "./ApiAlert";

interface ApiListProps {
  entitiyName: string;
  entityIdName: string;
}

const ApiList: React.FC<ApiListProps> = ({ entitiyName, entityIdName }) => {
  const params = useParams();
  const origin = useOrigin();

  const baseUrl = `${origin}/api/${params.storeId}`;

  return (
    <>
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/${entitiyName}`}
      />
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/${entitiyName}/(${entityIdName})`}
      />
      <ApiAlert
        title="POST"
        variant="admin"
        description={`${baseUrl}/${entitiyName}/`}
      />
      <ApiAlert
        title="PATCH"
        variant="admin"
        description={`${baseUrl}/${entitiyName}/(${entityIdName})`}
      />
      <ApiAlert
        title="DELETE"
        variant="admin"
        description={`${baseUrl}/${entitiyName}/(${entityIdName})`}
      />
    </>
  );
};

export default ApiList;
