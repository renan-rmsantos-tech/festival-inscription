import Image from "next/image";
import { isBeforeDeadline } from "@/lib/deadline";
import { RsvpForm } from "@/components/rsvp-form";

const INFO_ITEMS = [
  {
    num: "I.",
    label: "Santa Missa",
    content: (
      <>
        <p className="font-heading text-h2 leading-[48px] tracking-[-0.01em] font-bold text-navy">
          10h00
        </p>
        <p className="font-accent text-[22px] leading-[28px] italic font-medium text-body-ink">
          Santa Missa Solene em honra a São José, padroeiro do colégio.
        </p>
      </>
    ),
  },
  {
    num: "II.",
    label: "Consumação",
    content: (
      <>
        <div className="flex items-baseline gap-1.5">
          <span className="font-heading text-[28px] leading-[32px] font-semibold text-navy">
            R$
          </span>
          <span className="font-heading text-[56px] leading-[56px] tracking-[-0.02em] font-bold text-navy">
            5,00
          </span>
          <span className="font-sans text-[14px] leading-[20px] font-medium text-body-ink/60 ml-1.5">
            / ficha
          </span>
        </div>
        <p className="font-accent text-[22px] leading-[28px] italic font-medium text-body-ink">
          Cada ficha dá direito a uma porção. Toda renda é revertida para o
          colégio.
        </p>
      </>
    ),
  },
  {
    num: "III.",
    label: "Forma de pagamento",
    content: (
      <>
        <div className="flex flex-col gap-1">
          <p className="font-heading text-[38px] leading-[44px] tracking-[-0.01em] font-bold text-navy">
            Pix
          </p>
          <p className="font-accent text-[26px] leading-[30px] italic font-medium text-wine">
            ou dinheiro
          </p>
        </div>
        <p className="font-accent text-[22px] leading-[28px] italic font-medium text-body-ink">
          Estes serão os únicos meios de pagamentos permitidos.
        </p>
      </>
    ),
  },
  {
    num: "IV.",
    label: "Inscrições",
    content: (
      <>
        <div className="flex items-baseline gap-2.5">
          <span className="font-heading text-[56px] leading-[56px] tracking-[-0.02em] font-bold text-navy">
            25
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="font-heading text-[22px] leading-[22px] font-medium text-navy">
              / abril
            </span>
            <span className="font-sans text-[11px] leading-[14px] font-medium tracking-[0.18em] uppercase text-body-ink/60">
              Prazo final
            </span>
          </div>
        </div>
        <p className="font-accent text-[22px] leading-[28px] italic font-medium text-body-ink">
          Garanta sua presença inscrevendo a família abaixo até esta data.
        </p>
      </>
    ),
  },
] as const;

const PROGRAMA_ITEMS = [
  {
    time: "10h",
    period: "Manhã",
    title: "Santa Missa Solene",
    desc: "Em honra do nosso padroeiro São José, na capela do colégio.",
  },
  {
    time: "12h",
    period: "Após a Missa",
    title: "Delicioso Almoço",
    desc: "À venda no local — pratos quentes, saladas e sobremesas preparados com carinho.",
  },
  {
    time: "14h",
    period: "Tarde",
    title: "Jogos para as Crianças",
    desc: "Brincadeiras tradicionais e muitos prêmios para os pequenos aproveitarem.",
  },
  {
    time: "17h",
    period: "Encerramento",
    title: "Grande Bingo",
    desc: "O momento mais aguardado — cartelas, prêmios e a torcida da família inteira.",
  },
] as const;

export default async function Home() {
  const open = isBeforeDeadline();
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

      {/* ── Hero ── */}
      <section className="flex flex-col lg:flex-row items-center lg:items-stretch justify-between gap-10 lg:gap-20 px-6 lg:px-20 pt-12 lg:pt-24 pb-16 lg:pb-[120px]">
        <div className="flex flex-col items-start justify-center gap-8 lg:gap-10 flex-1">
          <div className="flex items-center gap-4">
            <div className="w-14 h-px bg-wine shrink-0 hidden sm:block" />
            <span className="font-sans text-caption-sm tracking-[0.28em] uppercase font-semibold text-wine">
              Festa Patronal · Anno Domini MMXXVI
            </span>
          </div>

          <div className="flex flex-col items-start">
            <h1 className="font-heading text-[56px] sm:text-[80px] lg:text-[128px] leading-[1] lg:leading-[112px] tracking-[-0.02em] font-black text-navy">
              Festa do
            </h1>
            <p className="font-accent text-[48px] sm:text-[72px] lg:text-[132px] leading-[1] lg:leading-[128px] tracking-[-0.015em] font-medium italic text-wine lg:-mt-2">
              Nosso Colégio
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pt-2">
            <div className="flex flex-col">
              <span className="font-sans text-[12px] leading-[16px] tracking-[0.24em] uppercase font-medium text-body-ink/70">
                Sábado
              </span>
              <span className="font-heading text-[36px] sm:text-[44px] lg:text-[56px] leading-[1.1] lg:leading-[60px] tracking-[-0.01em] font-bold text-body-ink">
                01 de Maio
              </span>
            </div>
            <div className="hidden sm:block w-px h-16 bg-body-ink/25 shrink-0" />
            <div className="flex flex-col gap-1.5">
              <span className="font-sans text-[15px] leading-[22px] font-medium text-body-ink">
                Santa Missa às 10h00
              </span>
              <span className="font-sans text-[15px] leading-[22px] text-body-ink/75">
                Colégio São José
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 pt-4">
            <a
              href="#inscricao"
              className="inline-flex items-center gap-3 rounded-sm bg-navy px-8 py-5 transition-opacity hover:opacity-90 active:opacity-80"
            >
              <span className="font-sans text-[14px] leading-[18px] tracking-[0.16em] uppercase font-semibold text-creme">
                Inscrever-se
              </span>
              <span className="font-sans text-[14px] leading-[18px] text-gold">
                →
              </span>
            </a>
            <span className="font-accent text-[17px] leading-[22px] italic font-medium text-body-ink/70">
              Inscrições abertas até 25 de abril
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center w-full max-w-[280px] lg:max-w-[420px] shrink-0">
          <Image
            src="/images/logo-csj.png"
            alt="Selo do Colégio São José"
            width={778}
            height={778}
            priority
            quality={95}
            sizes="(max-width: 640px) 200px, (max-width: 1024px) 260px, 340px"
            className="w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] lg:w-[340px] lg:h-[340px] object-contain"
          />
        </div>
      </section>

      {/* ── Details / Info Grid ── */}
      <section className="flex flex-col gap-10 lg:gap-14 px-6 lg:px-20 pt-16 lg:pt-20 pb-20 lg:pb-[120px] border-t border-border">
        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-[60px]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-px bg-wine shrink-0 hidden sm:block" />
              <span className="font-sans text-caption-sm tracking-[0.22em] uppercase font-semibold text-wine">
                I · Informações
              </span>
            </div>
            <h2 className="font-heading text-h2 sm:text-[56px] sm:leading-[64px] tracking-[-0.01em] font-bold text-navy">
              O essencial
              <br />
              do nosso dia.
            </h2>
          </div>
          <p className="font-accent text-[20px] leading-[32px] italic text-body-ink/80 max-w-[380px]">
            Prepare-se com antecedência — estas são as informações que você
            precisa saber.
          </p>
        </div>

        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {INFO_ITEMS.map((item, i) => {
            const borders = [
              "border-b sm:border-r lg:border-r",
              "border-b sm:border-r-0 lg:border-r",
              "border-b sm:border-b-0 sm:border-r lg:border-r",
              "sm:border-b-0",
            ][i];
            return (
            <div
              key={item.num}
              className={`flex flex-col gap-5 py-8 lg:py-10 px-0 sm:px-6 lg:px-10 first:pl-0 last:pr-0 border-border ${borders}`}
            >
              <div className="flex items-baseline gap-4">
                <span className="font-heading text-[14px] leading-[18px] tracking-[0.08em] font-semibold text-gold">
                  {item.num}
                </span>
                <span className="font-sans text-caption-sm tracking-[0.22em] uppercase font-semibold text-body-ink/60">
                  {item.label}
                </span>
              </div>
              {item.content}
            </div>
            );
          })}
        </div>
      </section>

      {/* ── Programa ── */}
      <section className="flex flex-col lg:flex-row gap-10 lg:gap-24 px-6 lg:px-20 py-20 lg:py-[120px] bg-navy text-creme">
        {/* Left column */}
        <div className="flex flex-col gap-8 lg:w-[420px] shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-px bg-gold shrink-0 hidden sm:block" />
            <span className="font-sans text-caption-sm tracking-[0.22em] uppercase font-semibold text-gold">
              II · Programa
            </span>
          </div>
          <h2 className="font-heading text-[48px] sm:text-[64px] leading-[1.05] tracking-[-0.015em] font-bold text-creme">
            Horários.
          </h2>
          <p className="font-accent text-[20px] leading-[30px] italic text-creme/75">
            Começamos com a Santa Missa e seguimos com um almoço típico, jogos
            para a criançada e o aguardado bingo da noite.
          </p>
        </div>

        {/* Right column — timeline */}
        <div className="flex flex-col flex-1">
          {PROGRAMA_ITEMS.map((item, i) => (
            <div
              key={item.time}
              className={`flex gap-6 sm:gap-10 py-8 ${
                i < PROGRAMA_ITEMS.length - 1
                  ? "border-b border-creme/20"
                  : ""
              }`}
            >
              <div className="flex flex-col gap-1 w-[80px] sm:w-[120px] shrink-0">
                <span className="font-heading text-[28px] sm:text-[32px] leading-[36px] font-bold text-gold">
                  {item.time}
                </span>
                <span className="font-sans text-[11px] leading-[14px] tracking-[0.2em] uppercase font-semibold text-creme/55">
                  {item.period}
                </span>
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <h3 className="font-heading text-[22px] sm:text-[28px] leading-[34px] tracking-[-0.005em] font-semibold text-creme">
                  {item.title}
                </h3>
                <p className="font-accent text-[16px] sm:text-[18px] leading-[26px] italic text-creme/75">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Inscrição ── */}
      <section
        id="inscricao"
        className="scroll-mt-20 flex flex-col gap-10 lg:gap-14 px-6 lg:px-20 py-20 lg:py-[120px] border-t border-border"
      >
        <div className="flex flex-col gap-4 items-center text-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-px bg-wine shrink-0 hidden sm:block" />
            <span className="font-sans text-caption-sm tracking-[0.22em] uppercase font-semibold text-wine">
              III · Inscrição
            </span>
            <div className="w-10 h-px bg-wine shrink-0 hidden sm:block" />
          </div>
          <h2 className="font-heading text-h2 sm:text-[56px] sm:leading-[64px] tracking-[-0.01em] font-bold text-navy">
            {open ? 'Inscreva sua família.' : 'Inscrições encerradas.'}
          </h2>
          {open && (
            <p className="font-accent text-[20px] leading-[32px] italic text-body-ink/80 max-w-[480px]">
              Preencha o formulário abaixo para confirmar a presença da sua
              família na festa.
            </p>
          )}
        </div>

        {open ? (
          <RsvpForm />
        ) : (
          <div className="flex flex-col items-center gap-4 py-8">
            <p className="font-accent text-[24px] leading-[34px] italic font-medium text-body-ink/80 text-center">
              Inscrições encerradas. Até sábado!
            </p>
          </div>
        )}
      </section>

      {/* ── Footer ── */}
      <footer className="flex flex-col gap-8 lg:gap-10 px-6 lg:px-20 pt-12 lg:pt-16 pb-10 lg:pb-12 border-t border-border">
        {/* Footer top */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-20">
          <div className="flex flex-col gap-4 max-w-[520px]">
            <h2 className="font-heading text-h3 tracking-[-0.01em] font-bold text-navy">
              Ite ad Ioseph.
            </h2>
            <p className="font-accent text-body leading-[28px] italic font-medium text-body-ink/75">
              &ldquo;Ide a José&rdquo; — como os egípcios em tempo de
              necessidade, recorramos ao nosso padroeiro e celebremos juntos.
            </p>
          </div>
          <div className="flex gap-12 sm:gap-[72px]">
            <div className="flex flex-col gap-3">
              <span className="font-sans text-[11px] leading-[14px] tracking-[0.22em] uppercase font-semibold text-body-ink/55">
                Local
              </span>
              <span className="font-sans text-[15px] leading-[22px] font-medium text-body-ink">
                Colégio São José
                <br />
                Pátio Principal
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-sans text-[11px] leading-[14px] tracking-[0.22em] uppercase font-semibold text-body-ink/55">
                Contato
              </span>
              <span className="font-sans text-[15px] leading-[22px] font-medium text-body-ink">
                secretaria@csj.edu.br
                <br />
                (11) 3000-0000
              </span>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-8 border-t border-border/60">
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
        </div>
      </footer>
    </main>
  );
}
