import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Legal terms and conditions governing the use of the OpenSource Together website and services.",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="w-full max-w-4xl px-6 md:mx-auto">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center">
        <h1 className="mt-3 text-center text-3xl">Terms and Conditions</h1>
        <p className="mt-3 text-center text-sm md:text-base">
          Legal terms governing your use of OpenSource Together.
        </p>
      </div>

      {/* Content */}
      <div className="mt-20 mb-28">
        <section className="my-8">
          <h2 className="text-xl font-medium tracking-tight">
            1. Acceptance of Terms
          </h2>
          <p className="text-muted-foreground mt-3">
            By accessing or using our website, you agree to be bound by these
            Terms. If you do not agree, you must not access or use the website.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-xl font-medium tracking-tight">
            2. Changes to These Terms
          </h2>
          <p className="text-muted-foreground mt-3">
            We may modify these Terms at any time. Material changes will be
            indicated by updating the effective date. Your continued use of the
            website after changes become effective constitutes acceptance of the
            updated Terms.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-xl font-medium tracking-tight">
            3. Eligibility and Accounts
          </h2>
          <p className="text-muted-foreground mt-3">
            You must be of legal age to form a binding contract in your
            jurisdiction to use certain parts of the website. If you create an
            account, you are responsible for maintaining the confidentiality of
            your credentials and for all activities under your account.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-xl font-medium tracking-tight">
            4. Acceptable Use
          </h2>
          <p className="text-muted-foreground mt-3">
            You agree not to misuse the website, including by attempting to gain
            unauthorized access, interfering with its operation, scraping or
            harvesting data without permission, or engaging in any activity that
            violates applicable laws or infringes rights of others.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-xl font-medium tracking-tight">
            5. User Content and Contributions
          </h2>
          <p className="text-muted-foreground mt-3">
            If you submit or post content, you represent that you have the
            necessary rights to do so and you grant us a non-exclusive,
            worldwide, royalty-free license to use, display, and distribute such
            content solely for operating and improving the website and services.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-xl font-medium tracking-tight">
            6. Intellectual Property
          </h2>
          <p className="text-muted-foreground mt-3">
            The website, trademarks, logos, and other materials are owned by
            OpenSource Together or its licensors and are protected by applicable
            IP laws. Except as permitted by law, you may not copy, modify,
            distribute, or create derivative works without prior written
            consent.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-xl font-medium tracking-tight">
            7. Third-Party Links
          </h2>
          <p className="text-muted-foreground mt-3">
            Our website may contain links to third-party websites. We are not
            responsible for the content, privacy policies, or practices of
            third-party websites and you access them at your own risk.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-xl font-medium tracking-tight">
            8. Disclaimer of Warranties
          </h2>
          <p className="text-muted-foreground mt-3">
            The website is provided on an "AS IS" and "AS AVAILABLE" basis
            without warranties of any kind, whether express or implied,
            including but not limited to implied warranties of merchantability,
            fitness for a particular purpose, and non-infringement.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-xl font-medium tracking-tight">
            9. Limitation of Liability
          </h2>
          <p className="text-muted-foreground mt-3">
            To the fullest extent permitted by law, OpenSource Together will not
            be liable for any indirect, incidental, special, consequential, or
            punitive damages, or any loss of profits or revenues, whether
            incurred directly or indirectly, or any loss of data, use, goodwill,
            or other intangible losses.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-xl font-medium tracking-tight">
            10. Indemnification
          </h2>
          <p className="text-muted-foreground mt-3">
            You agree to indemnify and hold harmless OpenSource Together and its
            affiliates from and against any claims, liabilities, damages,
            losses, and expenses, including reasonable attorneys’ fees, arising
            out of or in any way connected with your use of the website or
            violation of these Terms.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-xl font-medium tracking-tight">
            11. Termination
          </h2>
          <p className="text-muted-foreground mt-3">
            We may suspend or terminate your access to the website at any time,
            with or without notice, for conduct that we believe violates these
            Terms or is otherwise harmful.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-xl font-medium tracking-tight">
            12. Governing Law
          </h2>
          <p className="text-muted-foreground mt-3">
            These Terms shall be governed by and construed in accordance with
            the laws applicable in your place of residence unless otherwise
            required by law. Venue for any disputes shall be in a competent
            court of such jurisdiction.
          </p>
        </section>

        <section className="my-8">
          <h2 className="text-xl font-medium tracking-tight">13. Contact Us</h2>
          <p className="text-muted-foreground mt-3">
            If you have questions about these Terms, please contact us via our
            official channels listed on the website.
          </p>
        </section>
      </div>
    </div>
  );
}
