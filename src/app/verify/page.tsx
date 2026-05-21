import VerifyForm from "./VerifyForm";

type VerifyPageProps = {
  searchParams: Promise<{
    phone?: string;
  }>;
};

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const { phone = "" } = await searchParams;

  return <VerifyForm initialPhone={phone} />;
}
