import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - OpenSource Together",
  description:
    "Privacy Policy describing how OpenSource Together collects, uses, and protects your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto w-full">
      {/* Hero Section (mirrors guide) */}
      <div className="relative mx-auto w-full">
        <div className="relative z-10 mx-auto mb-5 flex min-h-[260px] w-full max-w-[1441px] flex-col items-center justify-center md:min-h-[320px] lg:min-h-[400px]">
          <div className="mx-6">
            <h1
              className="mt-3 text-center text-3xl leading-tight md:text-5xl"
              style={{ fontFamily: "Aspekta", fontWeight: 500 }}
            >
              Privacy Policy
            </h1>
            <p className="mt-5 max-w-[650px] text-center text-sm md:text-base">
              How we collect, use, and protect your information.
            </p>
            <p className="text-muted-foreground mt-3 max-w-[650px] text-center text-xs md:text-sm">
              This Privacy Policy explains our practices and your choices.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 pb-28">
        <section className="my-8">
          <h2 className="text-2xl font-medium tracking-tight">
            1. Introduction
          </h2>
          <p className="text-muted-foreground mt-3 text-sm">
            OpenSource Together ("we", "our", "us") is committed to protecting
            your privacy. This Privacy Policy describes how we handle personal
            information when you use our website and services.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-medium tracking-tight">
            2. Information We Collect
          </h2>
          <p className="text-muted-foreground mt-3 text-sm">
            We may collect information you provide directly (such as account
            details or content you submit) and information collected
            automatically (such as device, usage, and cookie data).
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-medium tracking-tight">
            3. How We Use Information
          </h2>
          <p className="text-muted-foreground mt-3 text-sm">
            We use information to operate and improve our services, personalize
            your experience, communicate with you, ensure security, and comply
            with legal obligations.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-medium tracking-tight">
            4. Cookies and Similar Technologies
          </h2>
          <p className="text-muted-foreground mt-3 text-sm">
            We use cookies and similar technologies to provide core
            functionality, remember preferences, and analyze usage. You can
            control cookies via your browser settings.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-medium tracking-tight">
            5. Data Sharing
          </h2>
          <p className="text-muted-foreground mt-3 text-sm">
            We may share information with service providers who help us operate
            the website, and as required by law. We do not sell your personal
            information.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-medium tracking-tight">
            6. Data Retention
          </h2>
          <p className="text-muted-foreground mt-3 text-sm">
            We retain personal information only as long as necessary for the
            purposes described in this policy or as required by law.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-medium tracking-tight">7. Security</h2>
          <p className="text-muted-foreground mt-3 text-sm">
            We implement reasonable safeguards to protect information. However,
            no method of transmission or storage is completely secure, and we
            cannot guarantee absolute security.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-medium tracking-tight">
            8. Your Rights
          </h2>
          <p className="text-muted-foreground mt-3 text-sm">
            Depending on your location, you may have rights such as access,
            correction, deletion, and objection. To exercise rights, contact us
            using the details provided below.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-medium tracking-tight">
            9. Children’s Privacy
          </h2>
          <p className="text-muted-foreground mt-3 text-sm">
            Our services are not directed to children under the age of 13, and
            we do not knowingly collect personal information from children.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-medium tracking-tight">
            10. Changes to This Policy
          </h2>
          <p className="text-muted-foreground mt-3 text-sm">
            We may update this Privacy Policy from time to time. Material
            changes will be indicated by updating the effective date. Your
            continued use of the website after changes become effective
            constitutes acceptance of the updated policy.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-medium tracking-tight">
            11. Contact Us
          </h2>
          <p className="text-muted-foreground mt-3 text-sm">
            If you have questions about this Privacy Policy, please contact us
            via our official channels listed on the website.
          </p>
        </section>
      </div>
    </div>
  );
}
