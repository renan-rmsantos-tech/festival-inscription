import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { db } from "@/lib/db";
import { rsvps } from "@/lib/db/schema";

export const runtime = "nodejs";

export default async function ConfirmacaoPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const rsvp = await db
    .select()
    .from(rsvps)
    .where(eq(rsvps.code, code))
    .then((rows) => rows[0]);

  if (!rsvp) notFound();

  const total = rsvp.adults + rsvp.children;

  return (
    <main className="flex flex-col flex-1">
      {/* ── Top Bar ── */}
      <header className="flex items-center justify-between px-6 py-5 lg:px-20 lg:py-7 border-b border-border">
        <div className="flex items-center gap-3.5">
          <Image
            src="/images/sacred-heart.jpg"
            alt=""
            width={26}
            height={26}
            className="shrink-0"
          />
          <div className="hidden sm:block w-px h-[18px] bg-body-ink/25" />
          <span className="hidden sm:block font-sans text-caption-sm tracking-[0.18em] uppercase font-medium text-navy">
            Colégio São José · FSSPX — ACIPEC
          </span>
        </div>
        <span className="font-accent text-[16px] leading-[20px] tracking-[0.04em] italic font-medium text-wine">
          Ite ad Joseph
        </span>
      </header>

      {/* ── Confirmation Card ── */}
      <section className="flex flex-1 items-center justify-center px-6 lg:px-20 py-16 lg:py-24">
        <div className="flex flex-col items-center gap-10 max-w-[520px] w-full">
          {/* Check icon */}
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-navy/10">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              className="text-navy"
            >
              <path
                d="M8 16.5L13.5 22L24 11"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Heading */}
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="font-sans text-caption-sm tracking-[0.22em] uppercase font-semibold text-wine">
              Inscrição confirmada
            </span>
            <h1 className="font-heading text-h2 sm:text-[56px] sm:leading-[64px] tracking-[-0.01em] font-bold text-navy">
              Obrigado, {rsvp.name.split(" ")[0]}!
            </h1>
          </div>

          {/* Comprovante number */}
          <div className="flex flex-col items-center gap-2 py-6 px-8 border border-border rounded-sm w-full">
            <span className="font-sans text-[11px] leading-[14px] tracking-[0.22em] uppercase font-semibold text-body-ink/55">
              Comprovante
            </span>
            <span className="font-heading text-[36px] sm:text-[44px] leading-[1.1] tracking-[-0.01em] font-bold text-navy">
              N° {rsvp.code}
            </span>
          </div>

          {/* Summary */}
          <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center justify-between py-3 border-b border-border/60">
              <span className="font-sans text-[15px] leading-[22px] text-body-ink/70">
                Responsável
              </span>
              <span className="font-sans text-[15px] leading-[22px] font-medium text-body-ink">
                {rsvp.name}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border/60">
              <span className="font-sans text-[15px] leading-[22px] text-body-ink/70">
                Total de pessoas
              </span>
              <span className="font-sans text-[15px] leading-[22px] font-medium text-body-ink">
                {total} {total === 1 ? "pessoa" : "pessoas"}
              </span>
            </div>
          </div>

          {/* Aviso */}
          <p className="font-accent text-[20px] leading-[30px] italic font-medium text-body-ink/80 text-center">
            Inscrição confirmada. A festa é sábado, 01 de maio, às 10h, no
            Colégio São José.
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 lg:px-20 py-8 border-t border-border">
        <div className="flex items-center gap-3.5">
          <Image
            src="/images/sacred-heart.jpg"
            alt=""
            width={28}
            height={28}
            className="shrink-0"
          />
          <div className="w-px h-[18px] bg-body-ink/25" />
          <span className="font-sans text-[12px] leading-[16px] tracking-[0.18em] uppercase font-medium text-body-ink/75">
            Colégio São José · FSSPX — ACIPEC
          </span>
        </div>
        <span className="font-accent text-[14px] leading-[18px] tracking-[0.04em] italic font-medium text-wine">
          © Anno Domini MMXXVI
        </span>
      </footer>
    </main>
  );
}
