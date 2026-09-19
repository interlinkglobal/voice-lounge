import { createFileRoute } from "@tanstack/react-router";
import { CmsContentControl } from "@/components/admin/CmsEditor";

export const Route = createFileRoute("/degsrc3k9m2v8q4p7x1n6t5r0b3h9w2f/podcasts")({ component: Page });
function Page() { return <CmsContentControl area="podcasts" />; }
