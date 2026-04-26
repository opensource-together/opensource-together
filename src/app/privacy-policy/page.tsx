import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy describing how OpenSource Together collects, uses, and protects your information.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="w-full max-w-4xl px-6 md:mx-auto">
      {/* Hero Section */}
      <div className="flex w-full flex-col items-start">
        <h1 className="mt-3 text-left text-[26px] leading-tight">
          Privacy Policy
        </h1>
        <p className="mt-3 text-left text-muted-foreground text-sm">
          How we collect, use, and protect your information.
        </p>
      </div>

      {/* Content */}
      <div className="mt-16 mb-28">
        <section className="my-8">
          <h2 className="font-medium text-lg tracking-tight">
            1. Introduction
          </h2>
          <p className="mt-3 text-muted-foreground text-sm">
            OpenSource Together ("we", "our", "us") is committed to protecting
            your privacy. This Privacy Policy describes how we handle personal
            information when you use our website and services.
          </p>
        </section>

        <section className="my-8">
          <h2 className="font-medium text-lg tracking-tight">
            2. Information We Collect
          </h2>
          <p className="mt-3 text-muted-foreground text-sm">
            We may collect information you provide directly (such as account
            details or content you submit) and information collected
            automatically (such as device, usage, and cookie data).
          </p>
        </section>

        <section className="my-8">
          <h2 className="font-medium text-lg tracking-tight">
            3. How We Use Information
          </h2>
          <p className="mt-3 text-muted-foreground text-sm">
            We use information to operate and improve our services, personalize
            your experience, communicate with you, ensure security, and comply
            with legal obligations.
          </p>
        </section>

        <section className="my-8">
          <h2 className="font-medium text-lg tracking-tight">
            4. Cookies and Similar Technologies
          </h2>
          <p className="mt-3 text-muted-foreground text-sm">
            We use cookies and similar technologies to provide core
            functionality, remember preferences, and analyze usage. You can
            control cookies via your browser settings.
          </p>
        </section>

        <section className="my-8">
          <h2 className="font-medium text-lg tracking-tight">
            5. Data Sharing
          </h2>
          <p className="mt-3 text-muted-foreground text-sm">
            We may share information with service providers who help us operate
            the website, and as required by law. We do not sell your personal
            information.
          </p>
        </section>

        <section className="my-8">
          <h2 className="font-medium text-lg tracking-tight">
            6. Data Retention
          </h2>
          <p className="mt-3 text-muted-foreground text-sm">
            We retain personal information only as long as necessary for the
            purposes described in this policy or as required by law.
          </p>
        </section>

        <section className="my-8">
          <h2 className="font-medium text-lg tracking-tight">7. Security</h2>
          <p className="mt-3 text-muted-foreground text-sm">
            We implement reasonable safeguards to protect information. However,
            no method of transmission or storage is completely secure, and we
            cannot guarantee absolute security.
          </p>
        </section>

        <section className="my-8">
          <h2 className="font-medium text-lg tracking-tight">8. Your Rights</h2>
          <p className="mt-3 text-muted-foreground text-sm">
            Depending on your location, you may have rights such as access,
            correction, deletion, and objection. To exercise rights, contact us
            using the details provided below.
          </p>
        </section>

        <section className="my-8">
          <h2 className="font-medium text-lg tracking-tight">
            9. Children’s Privacy
          </h2>
          <p className="mt-3 text-muted-foreground text-sm">
            Our services are not directed to children under the age of 13, and
            we do not knowingly collect personal information from children.
          </p>
        </section>

        <section className="my-8">
          <h2 className="font-medium text-lg tracking-tight">
            10. Changes to This Policy
          </h2>
          <p className="mt-3 text-muted-foreground text-sm">
            We may update this Privacy Policy from time to time. Material
            changes will be indicated by updating the effective date. Your
            continued use of the website after changes become effective
            constitutes acceptance of the updated policy.
          </p>
        </section>

        <section className="my-8">
          <h2 className="font-medium text-lg tracking-tight">11. Contact Us</h2>
          <p className="mt-3 text-muted-foreground text-sm">
            If you have questions about this Privacy Policy, please contact us
            via our official channels listed on the website.
          </p>
        </section>
      </div>
    </main>
  );
}
