export default function PrivacyPolicy() {
  const sections = [
    {
      title: "1. Information We Collect",
      subsections: [
        {
          heading: "Information You Provide",
          text: "When you register for an account, we collect your name, email address, password, and role (student or employer). Students may additionally provide their university, graduation year, resume, and profile details. Employers may provide company name, industry, and contact information.",
        },
        {
          heading: "Information We Collect Automatically",
          text: "When you use our Platform, we automatically collect certain information, including your IP address, browser type, operating system, referring URLs, and pages visited. This information helps us improve your experience and maintain the security of the Platform.",
        },
        {
          heading: "Cookies and Tracking Technologies",
          text: "We use cookies and similar tracking technologies to maintain your session, remember your preferences, and analyze usage patterns. You can control cookie settings through your browser, though disabling cookies may affect Platform functionality.",
        },
      ],
    },
    {
      title: "2. How We Use Your Information",
      subsections: [
        {
          heading: "Core Service Delivery",
          text: "We use your information to create and maintain your account, facilitate job applications between students and employers, send service-related notifications, and provide customer support.",
        },
        {
          heading: "Improvements and Analytics",
          text: "We analyze usage data in aggregate to improve our Platform features, understand user behavior, and develop new services. We do not sell individual usage data to third parties.",
        },
        {
          heading: "Communications",
          text: "With your consent, we may send you newsletters, career tips, and promotional communications. You may opt out of marketing emails at any time by clicking the unsubscribe link included in each message.",
        },
      ],
    },
    {
      title: "3. How We Share Your Information",
      subsections: [
        {
          heading: "With Employers",
          text: "When you apply for a job, your profile and resume are shared with the employer who posted the listing. By applying, you consent to this sharing. You may withdraw an application at any time from your dashboard.",
        },
        {
          heading: "Service Providers",
          text: "We share your information with trusted third-party service providers who assist us in operating the Platform, including cloud hosting, analytics, and email delivery. These providers are contractually obligated to protect your data.",
        },
        {
          heading: "Legal Requirements",
          text: "We may disclose your information if required to do so by law, in response to valid legal process, or to protect the rights, property, or safety of Student Career Portal, our users, or the public.",
        },
      ],
    },
    {
      title: "4. Data Security",
      subsections: [
        {
          heading: "Security Measures",
          text: "We implement industry-standard security measures including encrypted data transmission (TLS), hashed password storage, and access controls. However, no method of transmission over the internet is 100% secure.",
        },
        {
          heading: "Breach Notification",
          text: "In the event of a data breach that may compromise your personal information, we will notify affected users in accordance with applicable law and within a reasonable timeframe.",
        },
      ],
    },
    {
      title: "5. Your Rights and Choices",
      subsections: [
        {
          heading: "Access and Correction",
          text: "You may access and update your personal information at any time through your account settings. If you believe any information we hold is inaccurate, you may request a correction.",
        },
        {
          heading: "Data Deletion",
          text: "You may request deletion of your account and associated personal data by contacting us at privacy@studentcareerportal.com. Note that some data may be retained for legal compliance or to resolve disputes.",
        },
        {
          heading: "Data Portability",
          text: "Upon request, we will provide you with a copy of your personal data in a structured, machine-readable format where technically feasible.",
        },
      ],
    },
    {
      title: "6. Data Retention",
      subsections: [
        {
          heading: "Retention Periods",
          text: "We retain your personal data for as long as your account is active, or as needed to provide you with services. After account deletion, we may retain certain data for up to 12 months for legal and operational purposes before permanent deletion.",
        },
      ],
    },
    {
      title: "7. Third-Party Links",
      subsections: [
        {
          heading: "External Sites",
          text: "The Platform may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites. We encourage you to review the privacy policies of any external sites you visit.",
        },
      ],
    },
    {
      title: "8. Children's Privacy",
      subsections: [
        {
          heading: "Age Restriction",
          text: "Our Platform is not intended for use by individuals under the age of 16. We do not knowingly collect personal information from children under 16. If we become aware that a child has provided us with personal information, we will delete it promptly.",
        },
      ],
    },
    {
      title: "9. Changes to This Policy",
      subsections: [
        {
          heading: "Policy Updates",
          text: "We may update this Privacy Policy from time to time. We will notify you of significant changes by emailing you or by prominently posting a notice on the Platform. Your continued use of the Platform after changes take effect constitutes acceptance of the updated policy.",
        },
      ],
    },
    {
      title: "10. Contact Us",
      subsections: [
        {
          heading: "Privacy Inquiries",
          text: "If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact our Privacy Team at privacy@studentcareerportal.com. We will respond to all inquiries within 5 business days.",
        },
      ],
    },
  ]

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <div className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground mb-6">
            Legal
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: <span className="font-medium text-foreground">August 15, 2026</span>
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed max-w-2xl">
            Your privacy matters to us. This Privacy Policy explains what information we collect, how we use it, and the choices you have regarding your data.
          </p>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Contents</p>
          <ol className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
            {sections.map((s, i) => (
              <li key={i} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                <span className="font-medium text-foreground/60 mr-2">{i + 1}.</span>
                {s.title.replace(/^\d+\.\s/, "")}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="space-y-12">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-xl font-semibold text-foreground mb-6">{section.title}</h2>
              <div className="space-y-6">
                {section.subsections.map((sub) => (
                  <div key={sub.heading} className="pl-4 border-l-2 border-border">
                    <h3 className="text-sm font-semibold text-foreground mb-2">{sub.heading}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{sub.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 border-b border-border/50" />
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-12 p-6 rounded-2xl bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground leading-relaxed">
            This Privacy Policy is effective as of August 15, 2026. For privacy-related inquiries, contact{" "}
            <a href="mailto:privacy@studentcareerportal.com" className="text-foreground underline underline-offset-4 hover:text-primary transition-colors">
              privacy@studentcareerportal.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
