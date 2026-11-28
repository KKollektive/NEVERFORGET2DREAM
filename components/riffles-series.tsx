const coverChart = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Rose-Bullets-Illustrated-Release-Chart%281%29.pdf_20261124_014702_0000-EHRNgRSdgk0zKySvJCbdwnlITirYS4.png"

const books = [
  {
    number: "01",
    title: "Rose Bullets",
    leads: "Pixley & Ainsley",
    coverTop: 161.2,
    summary: "Ainsley returns after years away to find that Pixley has her own ideas about what she owes the family that raised her. Their shared past pulls them toward a marriage plan, while the research that once saved Ainsley brings a private extraction, a confrontation, and an open-ended choice about trust.",
    role: "The adult reunion at the heart of the saga.",
  },
  {
    number: "02",
    title: "Blood Rose",
    leads: "Pixley",
    coverTop: 311.9,
    summary: "After the joint story, Pixley follows the trail from her carefully managed childhood to Piper, Dr. Mosker’s research, and Nathan Boxley. The bloodline and nanotech discoveries connect her survival to a legacy whose consequences reach far beyond her marriage.",
    role: "Pixley follows the unanswered questions into her own legacy.",
  },
  {
    number: "03",
    title: "Barrel and Bloom",
    leads: "Ainsley Arnold",
    coverTop: 461.9,
    summary: "Ainsley returns as the Black Crown, ready to clean up and consolidate his empire. But his physical survival still depends on stabilization tied to Pixley, placing the future of his family in the hands of someone whose own future is already bound to it.",
    role: "Reveals Ainsley’s missing years and rise to power.",
  },
  {
    number: "04",
    title: "Thorned Bullets",
    leads: "Old Master Arnold & Lucy",
    coverTop: 612.7,
    summary: "A generation earlier, Arnold and Lucy build power out of heartbreak. Their private relationship, losses, and choices shape the patriarch—and explain how protection became authority and marriage became something the family planned.",
    role: "Traces the family’s rules back to their source.",
  },
  {
    number: "05",
    title: "Crimson Petals",
    leads: "Ames & Briena",
    coverTop: 761.9,
    summary: "Ainsley’s parents find tenderness and destructive passion inside the brutal world their son will inherit. Their choices about love, sacrifice, and family obligations shape the home and expectations that eventually reach Ainsley.",
    role: "Shows what the previous generation passed on to Ainsley.",
  },
] as const

export function RifflesSeries() {
  return (
    <section className="riffles-series" aria-labelledby="riffles-series-title">
      <div className="riffles-series-heading">
        <div>
          <p className="riffles-series-kicker">THE ROSE BULLETS SAGA · PROPOSED RELEASE ORDER</p>
          <h3 id="riffles-series-title">Riffles <em>&amp;</em> Roses</h3>
          <p className="riffles-series-intro">
            Pixley Aria Mosker has spent her life protected from the truth about her existence. Her mother’s secrets, her father’s research, and the mystery of her bloodline lead to a hidden civilization—and a legacy that could redefine humanity.
          </p>
        </div>
        <p className="riffles-series-note">Five connected stories.<br />One family legacy.</p>
      </div>

      <ol className="riffles-book-list" aria-label="Riffles and Roses books in proposed release order">
        {books.map((book) => (
          <li className="riffles-book-card" key={book.number}>
            <figure className="riffles-book-cover">
              <img
                src={coverChart}
                alt={`${book.title} book cover mockup`}
                loading="lazy"
                decoding="async"
                draggable={false}
                style={{ top: `-${book.coverTop}%` }}
              />
            </figure>
            <div className="riffles-book-copy">
              <p className="riffles-book-leads"><span>{book.number}</span>{book.leads}</p>
              <h4>{book.title}</h4>
              <p className="riffles-book-summary">{book.summary}</p>
              <p className="riffles-book-role"><span>IN THE SAGA</span>{book.role}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="riffles-chronology"><span>IN-WORLD CHRONOLOGY</span>Thorned Bullets → Crimson Petals → Barrel and Bloom → Rose Bullets → Blood Rose</p>
    </section>
  )
}
