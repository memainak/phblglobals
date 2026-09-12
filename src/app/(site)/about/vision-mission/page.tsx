import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Compass,
  Eye,
  ShieldCheck,
  HeartPulse,
  Scale,
  Microscope,
  Sparkles,
  Quote,
  Award,
  Calendar,
  MapPin,
  CheckCircle2,
  Users,
  Globe2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Vision, Mission & Founding Charter | Purusottam Homeo Bikash Lab',
  description:
    'We provide service excellence for you. Learn about the founding vision of Dr. Tarak Prasad Chatterjee, Dr. Swastipada Chatterjee, and Dr. Trinath Chatterjee at PHBL.',
};

export const revalidate = 3600;

export default function VisionMissionPage() {
  const values = [
    {
      icon: Scale,
      title: 'Pharmacopoeial Fidelity',
      description:
        'Every tincture, dilution, and biochemic compound strictly conforms to the Homoeopathic Pharmacopoeia of India (HPI) without synthetic shortcuts.',
    },
    {
      icon: Microscope,
      title: 'Chromatographic Transparency',
      description:
        'We validate raw herbs and finished batches through analytical testing and chromatography, eliminating batch-to-batch variations.',
    },
    {
      icon: ShieldCheck,
      title: 'Bonded Solvent Purity',
      description:
        'Utilizing solely 100% grain Extra Neutral Alcohol (ENA) to protect the subtle dynamic bio-energy of botanical actives.',
    },
    {
      icon: HeartPulse,
      title: 'Physician Empowerment',
      description:
        'Equipping clinicians with reliable, predictable therapeutic tools so treatment success is never compromised by medicinal impurity.',
    },
    {
      icon: Globe2,
      title: 'Nationwide & Global Reach',
      description:
        'Serving registered physicians across 18+ states in India while actively preparing global distribution pathways.',
    },
    {
      icon: Sparkles,
      title: 'Ethical Herbal Stewardship',
      description:
        'Sourcing authentic certified botanicals through sustainable agricultural partnerships that respect nature.',
    },
  ];

  return (
    <div className="py-12 bg-[#FAFAF8] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/about"
            className="text-xs font-semibold text-[#1F4D3A] hover:underline inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to About Company</span>
          </Link>
        </div>

        {/* Title Header */}
        <div className="space-y-3 border-b border-[rgba(18,21,15,0.08)] pb-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#1F4D3A] uppercase tracking-wider font-semibold">
            <Compass className="w-4 h-4" />
            <span>Institutional Charter & Founding Mission</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12150F]">
            Vision & Mission
          </h1>
          <div className="inline-block px-3.5 py-1.5 rounded-full bg-[#1F4D3A]/10 text-[#1F4D3A] font-serif font-bold text-sm tracking-wide">
            WE PROVIDE SERVICE EXCELLENCE FOR YOU
          </div>
        </div>

        {/* Founding Story & Mission Manifesto */}
        <div className="bg-white rounded-xl border border-[rgba(18,21,15,0.08)] p-6 sm:p-10 space-y-8 shadow-xs">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#1F4D3A]">
              <Quote className="w-4 h-4" />
              <span>Genesis & Historical Foundation</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#12150F] leading-snug">
              The Brainchild of Dr. Tarak Prasad Chatterjee
            </h2>

            <p className="text-sm sm:text-base text-[#12150F] leading-relaxed">
              <strong>PURUSOTTAM HOMOEO BIKASH LABORATORY</strong> is the brainchild of{' '}
              <strong>Dr. Tarak Prasad Chatterjee</strong> (Ex. H.O.D Obs & Gynae, M.H.M.C&H, Ex.
              President of K.H.M.C&H, Former Member of Gourav Study, Calcutta University). From the
              beginning of his career as a physician, he was inspired by the profound quotation of
              Master C.F.S. Hahnemann:
            </p>

            <div className="p-4 sm:p-5 rounded-lg bg-[#F0F5F2] border-l-4 border-[#1F4D3A] text-sm font-serif italic text-[#1F4D3A]">
              &ldquo;Every physician should prepare his own medicine.&rdquo;
            </div>

            <p className="text-sm sm:text-base text-[#595C54] leading-relaxed">
              Due to heavy clinical workload alongside his dedicated social work, he was unable to
              reach his manufacturing aim before 2003. When his two sons,{' '}
              <strong>Dr. Swastipada Chatterjee</strong> (M.Sc, BHMS, MD) and{' '}
              <strong>Dr. Trinath Chatterjee</strong> (B.Sc, BHMS), completed their professional
              studies, he shared his lifelong dream with them and instructed them to bring it to
              fruition.
            </p>

            <div className="p-4 sm:p-6 rounded-lg bg-[#FAFAF8] border border-[rgba(18,21,15,0.08)] space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs text-[#1F4D3A] font-semibold uppercase">
                <Calendar className="w-4 h-4" />
                <span>Historic Inauguration: 8th November, 2003</span>
              </div>
              <p className="text-sm text-[#12150F] leading-relaxed">
                On <strong>8th November, 2003</strong>, our firm was formally inaugurated by the
                Honourable District Magistrate, respected <strong>Mr. M.V. Rao</strong>, in the presence
                of a distinguished galaxy of luminaries from the homoeopathic world.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-lg bg-[#12150F] text-white space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-[#C9A227] font-semibold">
                The Founder&apos;s Inviolable Directive
              </div>
              <p className="font-serif italic text-base sm:text-lg text-neutral-200">
                &ldquo;I am your first customer. Don&apos;t disappoint me about the quality of medicines.&rdquo;
              </p>
              <p className="text-xs text-neutral-400">
                — Dr. T. P. Chatterjee to his sons and manufacturing team on Day One.
              </p>
            </div>

            <p className="text-sm sm:text-base text-[#595C54] leading-relaxed">
              Till today, under his direct vision and supervision, we continue our operations maintaining
              the strictest healthy and hygienic conditions. We proudly operate as an{' '}
              <strong>ISO 9001:2015, GMP (Schedule M-I), and HACCP certified</strong> laboratory for
              superior medicinal quality and better service to healthcare practitioners.
            </p>
          </div>

          {/* Operational Stewardship Split */}
          <div className="pt-6 border-t border-[rgba(18,21,15,0.08)] space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#12150F]">
              Strategic Leadership & Quality Governance (General Meeting, 2004)
            </h3>
            <p className="text-sm text-[#595C54] leading-relaxed">
              In 2004, our Founder called a general meeting with all staff and established our two
              operational pillars:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-5 rounded-lg bg-[#F8FAF9] border border-[#1F4D3A]/15 space-y-2">
                <div className="w-8 h-8 rounded-full bg-[#1F4D3A] text-white flex items-center justify-center font-bold text-xs font-mono">
                  1
                </div>
                <h4 className="font-serif font-bold text-base text-[#12150F]">
                  Quality Gatekeeping
                </h4>
                <p className="text-xs text-[#595C54] leading-relaxed">
                  Elder son <strong>Dr. S. P. Chatterjee</strong> (M.Sc, BHMS, MD) is tasked to oversee,
                  follow, and rigorously check the quality of our medicines at the final stage just
                  before release to market.
                </p>
              </div>

              <div className="p-5 rounded-lg bg-[#F8FAF9] border border-[#1F4D3A]/15 space-y-2">
                <div className="w-8 h-8 rounded-full bg-[#1F4D3A] text-white flex items-center justify-center font-bold text-xs font-mono">
                  2
                </div>
                <h4 className="font-serif font-bold text-base text-[#12150F]">
                  Market & Distribution Policy
                </h4>
                <p className="text-xs text-[#595C54] leading-relaxed">
                  Younger son <strong>Dr. Trinath Chatterjee</strong> (B.Sc, BHMS) is tasked to develop,
                  lead, and direct ethical trade policies and nationwide outreach to dispensaries and stockists.
                </p>
              </div>
            </div>
          </div>

          {/* Scale & Nationwide Reach */}
          <div className="pt-6 border-t border-[rgba(18,21,15,0.08)] space-y-3">
            <h3 className="font-serif text-xl font-bold text-[#12150F]">
              Comprehensive Formulation Spectrum & Geographical Reach
            </h3>
            <p className="text-sm text-[#595C54] leading-relaxed">
              Today, we produce a comprehensive portfolio of high-purity{' '}
              <strong>
                Homoeopathic Mother Tinctures, Potentised Dilutions, Patented Formulations, Ointments, and Clinical Drops
              </strong>
              . We proudly cover and serve registered medical institutions across{' '}
              <strong>more than 18 states in India</strong>, and are actively preparing to launch our
              standardised products in international markets across the globe.
            </p>
          </div>

          {/* Gratitude Statement */}
          <div className="p-6 rounded-lg bg-[#F0F5F2] border border-[#1F4D3A]/20 space-y-2">
            <h4 className="font-serif font-bold text-base text-[#1F4D3A]">
              Our Enduring Gratitude
            </h4>
            <p className="text-xs sm:text-sm text-[#1F4D3A] leading-relaxed">
              We are deeply grateful to God / Allah for His kind blessings upon our institution. We are
              forever grateful to our Founder for his unconditional love, wisdom, and ceaseless
              inspiration. We pray for his long life as a successful soldier of healing and service to
              humanity.
            </p>
          </div>
        </div>

        {/* Two-Panel Split: Institutional Vision & Mission Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vision Panel */}
          <div className="bg-white p-8 sm:p-10 rounded-lg border border-[rgba(18,21,15,0.08)] space-y-4 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-sm bg-[#F0F5F2] text-[#1F4D3A] flex items-center justify-center border border-[#1F4D3A]/20">
                <Eye className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono uppercase font-semibold text-[#1F4D3A] tracking-wider block">
                Our Institutional Vision
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#12150F]">
                Absolute Standardisation in Homoeopathic Medicine.
              </h2>
              <p className="text-sm text-[#595C54] leading-relaxed">
                To establish an Indian and global benchmark where every healthcare professional can
                administer tinctures, potencies, and specialty remedies with absolute clinical confidence
                that each lot is chemically pure, biologically potent, and thoroughly standardized.
              </p>
            </div>
            <div className="pt-4 border-t border-[rgba(18,21,15,0.06)] text-xs text-[#1F4D3A] font-semibold">
              The Physician&apos;s Trusted Pharmaceutical Partner
            </div>
          </div>

          {/* Mission Panel */}
          <div className="bg-[#12150F] text-white p-8 sm:p-10 rounded-lg border border-black space-y-4 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-sm bg-[#1F4D3A] text-emerald-300 flex items-center justify-center border border-emerald-800">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono uppercase font-semibold text-[#C9A227] tracking-wider block">
                Our Operational Mission
              </span>
              <h2 className="font-serif text-2xl font-bold text-white">
                Uncompromising Scientific & Hygienic Excellence.
              </h2>
              <p className="text-sm text-neutral-300 leading-relaxed">
                To maintain state-of-the-art bonded manufacturing units complying with Schedule M-I
                and ISO standards; to process only genuine botanicals and pristine Extra Neutral
                Alcohol; and to empower the medical fraternity through transparent quality and ethical
                service.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 text-xs text-[#C9A227] font-semibold">
              HL-792 M (Bonded) · Serving 18+ Indian States
            </div>
          </div>
        </div>

        {/* 6 Core Values Grid */}
        <div className="space-y-8 pt-8 border-t border-[rgba(18,21,15,0.08)]">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1F4D3A]">
              Pillars of Integrity
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#12150F]">
              Our Guiding Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, idx) => {
              const Icon = v.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-md border border-[rgba(18,21,15,0.08)] space-y-3 hover:border-[#1F4D3A]/30 transition-colors shadow-xs"
                >
                  <div className="w-9 h-9 rounded-sm bg-[#F0F5F2] text-[#1F4D3A] flex items-center justify-center border border-[#1F4D3A]/20">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#12150F]">
                    {v.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#595C54] leading-relaxed">
                    {v.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Founder's Credo Card */}
        <div className="bg-[#F8FAF9] rounded-lg border border-[#1F4D3A]/20 p-8 sm:p-10 space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#1F4D3A]">
            <Quote className="w-4 h-4" />
            <span>The Founder’s Clinical Credo</span>
          </div>

          <blockquote className="font-serif italic text-lg sm:text-xl text-[#12150F] max-w-3xl leading-relaxed">
            &ldquo;Every physician should prepare his own medicine. Where modern complexity prevents
            him from standing at the maceration tank, PHBL stands in his place—guided by identical
            clinical reverence, chemical purity, and moral responsibility.&rdquo;
          </blockquote>

          <div className="pt-4 border-t border-[rgba(18,21,15,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Image
                src="/images/founder-signature.jpg"
                alt="Signature of Dr. Tarak Prasad Chatterjee"
                width={160}
                height={34}
                className="h-8 w-auto mix-blend-multiply"
              />
              <div className="font-serif font-bold text-sm text-[#12150F] mt-1">
                Dr. Tarak Prasad Chatterjee
              </div>
              <div className="text-xs text-[#595C54]">
                Founder & Chairman · Purusottam Homeo Bikash Lab(Bonded)
              </div>
            </div>

            <div className="text-xs font-mono text-[#1F4D3A] bg-white px-3 py-2 rounded-xs border border-[#1F4D3A]/15 self-start sm:self-center">
              Drug Mfg License: HL-792 M · Estd. 2003
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
