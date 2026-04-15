export default function Home() {
  return (
    <main className="flex flex-col flex-1 items-center justify-center px-8 py-24 gap-10">
      <p className="font-sans text-caption uppercase tracking-[0.22em] font-semibold text-wine">
        Festa Patronal · Anno Domini MMXXVI
      </p>

      <div className="text-center space-y-2">
        <h1 className="font-heading text-h1 leading-[64px] tracking-[-0.01em] font-bold text-navy">
          Festa do Nosso Colégio
        </h1>
        <p className="font-accent text-body-lg leading-[30px] italic text-body-ink/80">
          01 de Maio — Colégio São José
        </p>
      </div>

      <p className="font-accent text-body leading-[28px] italic text-body-ink/75 max-w-md text-center">
        Precisamos saber quantas pessoas esperar para preparar a festa com o
        carinho que ela merece. Inscreva sua família abaixo.
      </p>

      <div className="flex gap-6 items-center">
        <span className="inline-flex items-center px-9 py-5 bg-navy text-creme font-sans text-body-sm font-medium">
          Inscrever-se
        </span>
        <span className="font-accent text-body-sm italic text-body-ink/70">
          Inscrições abertas até 25 de abril
        </span>
      </div>

      <footer className="mt-12 pt-8 border-t border-border w-full max-w-lg text-center">
        <p className="font-heading text-h3 leading-[40px] tracking-[-0.01em] font-bold text-navy mb-2">
          Ite ad Ioseph.
        </p>
        <p className="font-accent text-body italic text-body-ink/75">
          &ldquo;Ide a José&rdquo; — como os egípcios em tempo de necessidade.
        </p>
      </footer>
    </main>
  );
}
