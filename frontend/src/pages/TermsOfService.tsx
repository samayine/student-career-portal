export default function TermsOfService() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content:
        "By accessing or using Student Career Portal (the \"Platform\"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using the Platform.",
    },
    {
      title: "2. Use of the Platform",
      content:
        "You may use the Platform solely for lawful purposes and in accordance with these Terms. You agree not to use the Platform in any way that violates any applicable local, national, or international law or regulation; to transmit or procure the sending of any unsolicited communications; or to impersonate any person or entity.",
    },
    {
      title: "3. Account Registration",
      content:
        "To access certain features of the Platform, you must register for an account. You agree to provide accurate, current, and complete information during registration and to keep your account information up to date. You are responsible for maintaining the confidentiality of your account credentials.",
    },
    {
      title: "4. Student Accounts",
      content:
        "Students may create profiles, upload resumes, and apply for job listings posted by verified employers. By submitting an application, you confirm that all information provided is truthful and accurate. We reserve the right to remove any profile that violates our community guidelines.",
    },
    {
      title: "5. Employer Accounts",
      content:
        "Employers may post job listings and review student applications. All job postings must be for genuine roles. Misleading, fraudulent, or discriminatory postings are strictly prohibited and will result in immediate account termination.",
    },
    {
      title: "6. Intellectual Property",
      content:
        "The Platform and its original content, features, and functionality are and will remain the exclusive property of Student Career Portal and its licensors. Our trademarks may not be used in connection with any product or service without prior written consent.",
    },
    {
      title: "7. Privacy",
      content:
        "Your use of the Platform is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices.",
    },
    {
      title: "8. Disclaimer of Warranties",
      content:
        "The Platform is provided on an \"AS IS\" and \"AS AVAILABLE\" basis without any warranties of any kind, either express or implied. We do not warrant that the Platform will be uninterrupted, error-free, or free of viruses or other harmful components.",
    },
    {
      title: "9. Limitation of Liability",
      content:
        "To the fullest extent permitted by applicable law, Student Career Portal shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or goodwill, arising from your use of or inability to use the Platform.",
    },
    {
      title: "10. Changes to Terms",
      content:
        "We reserve the right to modify these Terms at any time. We will provide notice of significant changes by updating the date at the top of this page. Your continued use of the Platform after any change constitutes your acceptance of the new Terms.",
    },
    {
      title: "11. Contact Us",
      content:
        "If you have any questions about these Terms, please contact us at legal@studentcareerportal.com. We aim to respond to all inquiries within 2–3 business days.",
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
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">Terms of Service</h1>
          <p className="text-muted-foreground">
            Last updated: <span className="font-medium text-foreground">August 15, 2026</span>
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed max-w-2xl">
            Please read these Terms of Service carefully before using Student Career Portal. These terms govern your access to and use of our services.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.title} className="group">
              <h2 className="text-lg font-semibold text-foreground mb-3">{section.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{section.content}</p>
              <div className="mt-6 border-b border-border/50" />
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-12 p-6 rounded-2xl bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground leading-relaxed">
            By continuing to use Student Career Portal, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. For questions or concerns, reach out to our team at{" "}
            <a href="mailto:legal@studentcareerportal.com" className="text-foreground underline underline-offset-4 hover:text-primary transition-colors">
              legal@studentcareerportal.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
