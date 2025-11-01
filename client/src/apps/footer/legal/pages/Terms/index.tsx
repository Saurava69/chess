import React from "react";

import Separator from "@/components/common/Separator";
import * as styles from "../../index.module.css";

import iconLogo from "@assets/img/logo.svg";

function Terms() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <h1 className={styles.title}>
                    <img src={iconLogo} height={45} draggable={false} />
                    Terms of Service
                </h1>

                <Separator />

                <h2 style={{ margin: 0 }}>1. Introduction</h2>

                <span>
                    SyntaxEngineer.com (“We”, “Us”, “Service(s)”, “Website”) provides chess game
                    analysis tools and related chess utilities. For any questions regarding these
                    Terms, you can contact us at:
                </span>

                <b>{process.env.EMAIL_ACCOUNT}</b>

                <span>
                    1.1 These Terms of Service (“Terms”) form a legally binding agreement between
                    you, personally or on behalf of another entity (“You”), and us regarding your
                    use of our Services. By accessing or using our Services, you confirm that you
                    have read, understood, and agree to be bound by these Terms. If you do not
                    agree, you are strictly prohibited from using the Services.
                </span>

                <span>
                    1.2 We reserve the right to modify or update these Terms at any time, at our
                    discretion. While we may notify users of major updates, you acknowledge that
                    it is your responsibility to review these Terms periodically. The latest
                    revision date will always be stated at the end of this document.
                </span>

                <span>
                    1.3 By continuing to use the Services after any updates, you automatically
                    agree to the revised Terms.
                </span>

                <span>
                    1.4 We may, at our discretion, monitor use of the Services to ensure
                    compliance with these Terms and take any appropriate action, including legal
                    measures, against violations or unlawful behavior.
                </span>

                <h2 style={{ margin: 0 }}>2. General Acceptable Use</h2>

                <span>
                    While using our Services, you must not:
                    <ul>
                        <li>2.1 Use the Services for illegal activities or assist others in doing so.</li>
                        <li>
                            2.2 Engage in spamming or activities that disrupt or degrade our
                            infrastructure or ability to deliver Services.
                        </li>
                        <li>2.3 Upload or distribute content you do not have the rights to.</li>
                        <li>2.4 Upload, share, or promote malware or any harmful code.</li>
                        <li>2.5 Attempt to disrupt, damage, or interfere with our Services.</li>
                        <li>
                            2.6 Use bots, scrapers, or scripts to collect data in a way that harms
                            our infrastructure or operations.
                        </li>
                        <li>
                            2.7 Attempt to access restricted areas or information without explicit
                            permission.
                        </li>
                        <li>
                            2.8 Attempt to defraud, impersonate, or gain unauthorized access to
                            accounts or sensitive data.
                        </li>
                        <li>
                            2.9 Defame or disparage us, our Services, or other users in any form.
                        </li>
                        <li>
                            2.10 Harass, threaten, or abuse us or other users.
                        </li>
                        <li>
                            2.11 Copy, modify, or redistribute our software beyond the permissions
                            allowed by its copyright license.
                        </li>
                    </ul>
                </span>

                <h2 style={{ margin: 0 }}>3. Interruption or Modification to Services</h2>

                <span>
                    3.1 We may modify, limit, or remove any portion of the Services at any time,
                    with or without notice. We are not responsible for any loss or inconvenience
                    resulting from such actions.
                </span>

                <span>
                    3.2 We do not guarantee uninterrupted availability of the Services. Technical
                    failures, maintenance, or unforeseen events may occur, and we are not liable
                    for any damages or inconvenience resulting from downtime.
                </span>

                <span>
                    3.3 Nothing in these Terms obligates us to maintain, update, or provide
                    support for the Services.
                </span>

                <h2 style={{ margin: 0 }}>4. Account Registration</h2>

                <span>
                    4.1 You may create an account to access certain Services. By doing so, you
                    confirm that all information provided is accurate, current, and complete, and
                    you agree to keep it updated. You are solely responsible for maintaining
                    account confidentiality and activity.
                </span>

                <span>
                    4.2 We reserve the right to modify usernames or display names for any reason,
                    including if we deem them inappropriate or offensive.
                </span>

                <span>
                    4.3 We also reserve the right to terminate accounts or restrict access to our
                    Services at any time, for any reason or no reason, including violations of
                    these Terms.
                </span>

                <span>
                    4.4 As outlined in <b>Section 2.2</b>, you may not use the account system to
                    create multiple unused accounts or spam registrations that disrupt our
                    platform or performance.
                </span>

                <h2 style={{ margin: 0 }}>5. User Contributed Content</h2>

                <span>
                    5.1 You may upload content (“Content”) such as chess games, analysis data, or
                    other materials. By uploading, you confirm you own or have permission to
                    share such Content and that it does not violate third-party rights. If you
                    believe your copyright has been infringed, contact us immediately.
                </span>

                <span>
                    5.2 By uploading Content, you grant us an unrestricted, perpetual, transferable,
                    royalty-free, worldwide license to use, host, reproduce, distribute, and
                    display that Content for any lawful purpose, including commercial use or
                    creating derivative works.
                </span>

                <span>
                    5.3 You retain ownership of your Content but accept full responsibility for
                    it. You agree to hold us harmless from any claims, damages, or disputes
                    arising from your Content.
                </span>

                <span>
                    5.4 We reserve the right to remove, limit, or restrict access to any Content
                    without notice for any reason, including violations of these Terms. Such
                    actions fall under the rights granted in <b>Section 5.2</b>.
                </span>

                <h2 style={{ margin: 0 }}>6. Third-party Websites and Content</h2>

                <span>
                    Our Services may contain links to third-party websites or materials (“Third-Party
                    Content”), including text, media, or software. We do not review or endorse
                    this content and are not responsible for its accuracy, availability, or
                    legality. Accessing Third-Party Content is done entirely at your own risk and
                    outside the scope of these Terms. We are not liable for any loss or damage
                    resulting from such access.
                </span>

                <span>
                    Common examples include advertisements and Google-based sign-in features.
                </span>

                <h2 style={{ margin: 0 }}>7. Privacy</h2>

                <span>
                    Our <a href="/privacy">Privacy Policy</a> describes what data we collect, how
                    it’s used, and your options regarding data handling.
                </span>

                <h2 style={{ margin: 0 }}>8. Limitation of Liability</h2>

                <span>
                    The Services are provided “as is,” without warranties of any kind, express or
                    implied. We and our affiliates are not responsible for losses, damages, or
                    inconvenience caused by your use or inability to use the Services — including
                    but not limited to data loss, service outages, or performance issues. This
                    limitation applies even if we have been advised of potential damages.
                </span>

                <span>
                    Regardless of cause or action, our total liability to you will not exceed the
                    amount paid by you, if any, for use of the Services.
                </span>

                <h2 style={{ margin: 0 }}>9. Governing Law</h2>

                <span>
                    These Terms are governed by the laws of the United Kingdom. Any disputes will
                    be resolved under the jurisdiction of UK courts unless otherwise required by
                    mandatory law.
                </span>

                <span>Last revision date: 1st November 2025</span>
            </div>
        </div>
    );
}

export default Terms;
