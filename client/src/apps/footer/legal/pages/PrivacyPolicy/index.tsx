import React from "react";

import Separator from "@/components/common/Separator";
import { manageDataConsent } from "@/lib/consent";

import * as styles from "../../index.module.css";

import iconLogo from "@assets/img/logo.svg";

function PrivacyPolicy() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <h1 className={styles.title}>
                    <img
                        src={iconLogo}
                        height={45}
                        draggable={false}
                    />
                    Privacy Policy
                </h1>

                <Separator />

                <h2 style={{ margin: 0 }}>1. Glossary</h2>

                <span>
                    1.1 "The Service", "The Website", "We", "Our", "Us" — refer to the
                    SyntaxEngineer.com website and any related services we provide. This also
                    represents the entity responsible for collecting your information.
                </span>

                <span>
                    1.2 "The User", "You", "Your" — refer to the individual or entity whose
                    information is collected or processed by us.
                </span>

                <h2 style={{ margin: 0 }}>2. Data We Collect</h2>

                <h3 style={{ margin: 0 }}>2.1 General</h3>

                <span>
                    We collect IP addresses to establish a secure connection between you and
                    the Website. To maintain proper security, we may also gather:
                    <ul>
                        <li>Information about your web browser</li>
                        <li>Information about your device</li>
                        <li>Website usage data</li>
                    </ul>
                    For additional details, refer to the{" "}
                    <a href="https://www.cloudflare.com/en-gb/privacypolicy/">
                        Cloudflare, Inc. Privacy Policy
                    </a>
                    . Since we use Cloudflare as our security provider, and it is based in the
                    United States, using the Website means you consent to your data being
                    processed there.
                </span>

                <span>
                    We also use local storage to preserve information between sessions,
                    including:
                    <ul>
                        <li>
                            Preferences you’ve set on the settings page (excluding account
                            settings, which are stored on our servers)
                        </li>
                        <li>Your selected language preference</li>
                    </ul>
                    This data stays on your device and enhances your experience on the
                    Website.
                </span>

                <h3 style={{ margin: 0 }}>3. Game Analysis</h3>

                <span>
                    3.1 Cookies are used to store a session token string. This helps you avoid
                    repeatedly solving CAPTCHAs when accessing Chess analysis and move
                    classification. The token contains no personal data. The CAPTCHA system is
                    proof-of-work based and does not collect personal information. Disabling
                    cookies may cause reduced functionality.
                </span>

                <span>
                    3.2 When you analyze a game on the Website, we collect the information you
                    explicitly provide — namely the PGN (Portable Game Notation) file. This
                    file may include:
                    <ul>
                        <li>Player names and ratings</li>
                        <li>Tournament or event information</li>
                        <li>Time control, results, and other metadata</li>
                    </ul>
                    We use PGN files solely to process your analysis request. In some cases,
                    anonymized PGNs may be kept for research and improvement of our services.
                </span>

                <span>
                    3.3 If you search games from your Chess.com or Lichess accounts, your
                    username is shared with those platforms. Chess.com processes data in the
                    United States, and Lichess in France. By using these integrations, you
                    consent to data processing under their respective jurisdictions.
                </span>

                <a href="https://www.chess.com/legal/privacy">Chess.com Privacy Policy</a>
                <a href="https://lichess.org/privacy">Lichess.org Privacy Policy</a>

                <span>
                    3.4 We use local storage to retain certain analysis-related data between
                    sessions, such as:
                    <ul>
                        <li>
                            The last selected game source (e.g., PGN, Chess.com, etc.)
                        </li>
                        <li>
                            The last input you provided for each source (e.g., username or last
                            PGN string)
                        </li>
                    </ul>
                </span>

                <h3 style={{ margin: 0 }}>4. Game Archive</h3>

                <span>
                    4.1 If you have an account, you may save analyzed games to your{" "}
                    <a href="/archive">Game Archive</a>. To provide this service, we collect:
                    <ul>
                        <li>
                            The PGN file, including metadata (see <b>Section 3.2</b>)
                        </li>
                        <li>Engine evaluations and suggested moves</li>
                        <li>Move classifications generated during analysis</li>
                    </ul>
                    This information is stored until you delete the game or your account.
                </span>

                <h3 style={{ margin: 0 }}>5. Accounts</h3>

                <span>
                    You may choose to create an account on the Website. It’s optional, but
                    required for some features.
                </span>

                <span>
                    When registering, we collect only the details you provide:
                    <ul>
                        <li>Email address</li>
                        <li>Username</li>
                        <li>Display name (if signing in via Google)</li>
                        <li>Profile picture (if signing in via Google)</li>
                        <li>Hashed password (if registering with credentials)</li>
                    </ul>
                    This data remains stored as long as your account is active.
                </span>

                <h2 style={{ margin: 0 }}>6. Data Shared with Third Parties</h2>

                <span>
                    6.1 We use Google AdSense to display ads. Google LLC uses cookies to serve
                    personalized advertisements. When you first visit, or whenever you click{" "}
                    <a className={styles.link} onClick={manageDataConsent}>
                        Privacy Settings
                    </a>
                    {" "}in the footer, you can choose whether to consent to this data
                    collection.
                </span>

                <span>
                    6.2 You can withdraw your consent anytime using the same prompt. To learn
                    more about how Google processes this information, see the{" "}
                    <a href="https://policies.google.com/privacy">
                        Google LLC Privacy Policy
                    </a>
                    .
                </span>

                <h2 style={{ margin: 0 }}>7. Children's Privacy</h2>

                <span>
                    We do not knowingly collect personal data from anyone under 13 years of
                    age. If you believe we have done so, please contact us immediately.
                </span>

                <h2 style={{ margin: 0 }}>8. Your Data Rights</h2>

                <span>Under GDPR, you have the right to:</span>

                <ul>
                    <li>Request a copy of the personal data we hold about you.</li>
                    <li>
                        Request deletion of your personal data by deleting your account via{" "}
                        <a href="/settings/account">the account settings page</a>.
                    </li>
                    <li>
                        Request correction of your data if it is inaccurate, incomplete, or
                        outdated.
                    </li>
                </ul>

                <h2 style={{ margin: 0 }}>9. Revisions</h2>

                <span>
                    Updates to this Privacy Policy will be announced on this page.
                </span>

                <span>Last revision date: 1st November 2025</span>

                <h2 style={{ margin: 0 }}>10. Contact Us</h2>

                <span>
                    For questions about this policy or to exercise your data rights, contact
                    us at:
                </span>

                <b>{process.env.EMAIL_ACCOUNT}</b>
            </div>
        </div>
    );
}

export default PrivacyPolicy;
