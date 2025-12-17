import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LuCheck, LuCircle } from "react-icons/lu";

import CTAFooter from "@/shared/components/layout/cta-footer";

export const metadata: Metadata = {
  title: "Guide",
  description:
    "Understand the fundamentals, prepare your project, and release it publicly with confidence.",
  alternates: { canonical: "/oss-guide" },
};

export default function GuidePage() {
  return (
    <main className="mx-auto w-full">
      {/* Hero Section */}
      <div className="relative mx-auto w-full">
        <Image
          src="/illustrations/traveler.png"
          alt="Traveler illustration"
          width={1441}
          height={400}
          priority
          fetchPriority="high"
          quality={85}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 95vw, (max-width: 1024px) 100vw, 1441px"
          className="absolute bottom-10 left-1/2 z-[-1] h-auto w-[100%] -translate-x-1/2 object-contain sm:bottom-0 sm:w-[95%] md:bottom-6 md:w-[100%] lg:bottom-3 lg:w-[105%]"
        />

        <div className="relative z-10 mx-auto mb-5 flex min-h-[260px] w-full max-w-[1441px] flex-col items-center justify-center md:min-h-[320px] lg:min-h-[400px]">
          <div className="mx-6">
            <h1
              className="mt-3 text-center text-3xl leading-tight md:text-5xl"
              style={{ fontFamily: "Aspekta", fontWeight: 500 }}
            >
              Getting Started with <br />
              Open Source
            </h1>
            <p className="mt-5 max-w-[650px] text-center text-sm md:text-base">
              Your trusted partner for taking your project from{" "}
              <strong>closed</strong> to <strong>open</strong>.
            </p>

            <p className="mt-3 max-w-[650px] text-center text-muted-foreground text-xs md:text-sm">
              This guide will help you understand the fundamentals, prepare your
              project, and release it publicly with confidence.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 pb-28">
        {/* Why Go Open Source */}
        <section className="my-16">
          <div className="mb-6 flex items-center gap-3">
            <h2 className="font-medium text-2xl tracking-tight">
              Why Go Open Source?
            </h2>
          </div>
          <p className="mb-6 text-muted-foreground">
            Open source is more than code — it's a mindset. When you make your
            project open, you:
          </p>
          <div className="space-y-3">
            {[
              "Encourage transparency and collaboration",
              "Attract contributors and grow a community",
              "Build credibility for your work or product",
              "Create opportunities for learning and visibility",
            ].map((benefit) => (
              <div key={benefit} className="flex items-start gap-3">
                <LuCheck className="mt-0.5 h-5 w-5 shrink-0 text-ost-blue-three" />
                <p className="text-sm leading-relaxed">{benefit}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Your Open Source Experience */}
        <section className="mb-16">
          <h2 className="mb-10 text-center font-medium text-2xl tracking-tight">
            Your Open Source Experience
          </h2>

          <div className="space-y-10 md:space-y-20">
            {/* Step 1 */}
            <div>
              <div className="mb-4">
                <span className="mb-1 block font-medium text-ost-blue-three text-sm">
                  Step 1
                </span>
                <h3 className="font-medium text-xl">Assess Readiness</h3>
              </div>
              <p className="mb-4 text-muted-foreground">
                Before going public, review your repository and make sure it's
                ready to be shared.
              </p>
              <h4 className="mb-3 font-medium">Quick checklist</h4>
              <ul className="space-y-2">
                {[
                  "Your code is clean and free of sensitive data (API keys, credentials, etc.)",
                  "You've removed all private or company-specific information",
                  "The documentation is understandable by someone outside your team",
                  "The project builds and runs without internal dependencies",
                  "You've discussed ownership and licensing with your team",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <LuCircle className="mt-1 h-4 w-4 shrink-0 text-ost-blue-three" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 rounded-lg bg-accent p-3 text-sm">
                <strong>Tip:</strong> A "clean repo" builds trust. Review your
                commit history and configuration files before opening the
                project.
              </div>
            </div>

            {/* Step 2 */}
            <div>
              <div className="mb-4">
                <span className="mb-1 block font-medium text-ost-blue-three text-sm">
                  Step 2
                </span>
                <h3 className="font-medium text-xl">
                  Choose the Right License
                </h3>
              </div>
              <p className="mb-4 text-muted-foreground">
                A license defines how others can use, modify, and distribute
                your code. Without one, your project is not legally open source.
              </p>
              <h4 className="mb-3 font-medium">Popular choices</h4>
              <div className="space-y-3">
                <div>
                  <h5 className="font-medium">MIT</h5>
                  <p className="text-muted-foreground text-sm">
                    Simple and permissive. Ideal for personal and startup
                    projects.
                  </p>
                </div>
                <div>
                  <h5 className="font-medium">Apache 2.0</h5>
                  <p className="text-muted-foreground text-sm">
                    Adds patent protection. Common for corporate or large-scale
                    use.
                  </p>
                </div>
                <div>
                  <h5 className="font-medium">GPLv3</h5>
                  <p className="text-muted-foreground text-sm">
                    Requires derivatives to remain open. Used for
                    community-driven tools.
                  </p>
                </div>
              </div>
              <div className="mt-4 text-muted-foreground text-sm">
                <strong> Resource:</strong>{" "}
                <Link
                  href="https://choosealicense.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ost-blue-three underline"
                >
                  choosealicense.com
                </Link>
              </div>
              <p className="mt-2 text-muted-foreground text-sm">
                Once selected, create a file named{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                  LICENSE
                </code>{" "}
                at the root of your repository.
              </p>
            </div>

            {/* Step 3 */}
            <div>
              <div className="mb-4">
                <span className="mb-1 block font-medium text-ost-blue-three text-sm">
                  Step 3
                </span>
                <h3 className="font-medium text-xl">Document Everything</h3>
              </div>
              <p className="mb-4 text-muted-foreground">
                Good documentation is the heart of a healthy open-source
                project. It lowers the entry barrier for newcomers and
                encourages contributions.
              </p>
              <h4 className="mb-3 font-medium">Essential files to include</h4>
              <div className="space-y-3">
                {[
                  {
                    file: "README.md",
                    purpose:
                      "The face of your project. Explains what it is, how to use it, and why it matters.",
                  },
                  {
                    file: "CONTRIBUTING.md",
                    purpose:
                      "Guides people on how to propose changes or new features.",
                  },
                  {
                    file: "CODE_OF_CONDUCT.md",
                    purpose: "Defines acceptable behavior in your community.",
                  },
                  {
                    file: "SECURITY.md",
                    purpose:
                      "Explains how to report vulnerabilities responsibly.",
                  },
                ].map((doc) => (
                  <div key={doc.file}>
                    <code className="font-medium text-sm">{doc.file}</code>
                    <p className="mt-1 text-muted-foreground text-sm">
                      {doc.purpose}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-muted-foreground text-sm">
                Optional but recommended: add issue and pull request templates
                in{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                  .github/
                </code>
                .
              </p>
            </div>

            {/* Step 4 */}
            <div>
              <div className="mb-4">
                <span className="mb-1 block font-medium text-ost-blue-three text-sm">
                  Step 4
                </span>
                <h3 className="font-medium text-xl">
                  Structure Your Repository
                </h3>
              </div>
              <p className="mb-4 text-muted-foreground">
                A clear structure helps others explore and contribute
                confidently.
              </p>
              <h4 className="mb-3 font-medium">Example layout</h4>
              <pre className="overflow-x-auto rounded-lg border border-muted-black-stroke bg-accent p-4 text-xs">
                <code>{`my-project/
├── src/
├── tests/
├── docs/
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
└── SECURITY.md`}</code>
              </pre>
              <p className="mt-4 text-muted-foreground text-sm">
                Keep it simple. The goal is clarity — not complexity.
              </p>
            </div>

            {/* Step 5 */}
            <div>
              <div className="mb-4">
                <span className="mb-1 block font-medium text-ost-blue-three text-sm">
                  Step 5
                </span>
                <h3 className="font-medium text-xl">Build for Collaboration</h3>
              </div>
              <p className="mb-4 text-muted-foreground">
                Once your project is public, you're not just sharing code —
                you're inviting people to join your journey.
              </p>
              <h4 className="mb-3 font-medium">Best practices</h4>
              <ul className="space-y-2">
                {[
                  "Use Issues and Pull Requests on GitHub to manage contributions",
                  "Label beginner-friendly tasks with tags like 'good first issue'",
                  "Automate checks (linting, tests) to maintain quality",
                  "Be kind and responsive — community health starts with communication",
                ].map((practice) => (
                  <li key={practice} className="flex items-start gap-3">
                    <LuCircle className="mt-1 h-4 w-4 shrink-0 text-ost-blue-three" />
                    <span className="text-sm">{practice}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 rounded-lg bg-accent p-3 text-muted-foreground text-sm italic">
                "Open source is not about perfection. It's about progress
                through collaboration."
              </div>
            </div>

            {/* Step 6 */}
            <div>
              <div className="mb-4">
                <span className="mb-1 block font-medium text-ost-blue-three text-sm">
                  Step 6
                </span>
                <h3 className="font-medium text-xl">
                  Manage Security & Maintenance
                </h3>
              </div>
              <p className="mb-4 text-muted-foreground">
                Opening your code also means maintaining it responsibly.
              </p>
              <h4 className="mb-3 font-medium">Recommendations</h4>
              <ul className="space-y-2">
                {[
                  "Add a SECURITY.md file with a private contact for disclosures",
                  "Regularly review dependencies for vulnerabilities",
                  "Automate tests and CI/CD if possible",
                  "Communicate updates clearly through releases or changelogs",
                ].map((rec) => (
                  <li key={rec} className="flex items-start gap-3">
                    <LuCircle className="mt-1 h-4 w-4 shrink-0 text-ost-blue-three" />
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 rounded-lg bg-accent p-3 text-sm">
                <strong> </strong>Responsible open source means balancing
                transparency with safety.
              </div>
            </div>

            {/* Step 7 */}
            <div>
              <div className="mb-4">
                <span className="mb-1 block font-medium text-ost-blue-three text-sm">
                  Step 7
                </span>
                <h3 className="font-medium text-xl">Share and Grow</h3>
              </div>
              <p className="mb-4 text-muted-foreground">
                Your open-source journey doesn't end with the release — it
                starts there.
              </p>
              <ul className="space-y-2">
                {[
                  "Announce your project on social media and developer platforms",
                  "Tag your repo with relevant topics (e.g., 'open-source', 'nextjs', 'community')",
                  "Engage with early contributors — they are your first advocates",
                  "Consider joining the OST Verified Program for visibility and recognition",
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-3">
                    <LuCircle className="mt-1 h-4 w-4 shrink-0 text-ost-blue-three" />
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Additional Resources */}
        <section className="mb-16">
          <h2 className="mb-6 font-medium text-2xl tracking-tight">
            Additional Resources
          </h2>
          <div className="space-y-3">
            {[
              {
                topic: "Official Open Source Guides",
                link: "https://opensource.guide",
              },
              {
                topic: "Community Health Files",
                link: "https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions",
              },
              {
                topic: "Choosing a License",
                link: "https://choosealicense.com",
              },
              {
                topic: "Accessibility Checklist",
                link: "https://www.a11yproject.com/checklist/",
              },
              {
                topic: "Contributor Covenant",
                link: "https://www.contributor-covenant.org/",
              },
            ].map((resource) => (
              <Link
                key={resource.link}
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl border border-muted-black-stroke p-4 transition-shadow hover:shadow-xs"
              >
                <p className="font-medium">{resource.topic}</p>
                <p className="mt-1 truncate text-muted-foreground text-sm">
                  {resource.link}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
      {/* CTA OST */}
      <CTAFooter
        imageIllustration="/illustrations/winged-angel.png"
        imageIllustrationMobile="/illustrations/winged-angel-mobile.png"
      />
    </main>
  );
}
