/**
 * MyQ Cookie Consent — orestbida/cookieconsent v3
 * @see https://cookieconsent.orestbida.com
 *
 * IMPORTANT: The library JS + CSS must be loaded from CDN BEFORE this file.
 *   CSS: https://cdn.jsdelivr.net/npm/vanilla-cookieconsent@3.1.0/dist/cookieconsent.css
 *   JS:  https://cdn.jsdelivr.net/npm/vanilla-cookieconsent@3.1.0/dist/cookieconsent.umd.js
 */

(function () {
    var style = document.createElement('style');
    style.textContent = [
        '#cc-main {',
        '  --cc-font-family: "Ubuntu", sans-serif;',
        '  --cc-bg: #fff;',
        '  --cc-primary-color: #242A31;',
        '  --cc-secondary-color: #363F47;',
        /* Primary button — Accept all */
        '  --cc-btn-primary-bg: #DA0027;',
        '  --cc-btn-primary-color: #fff;',
        '  --cc-btn-primary-border-color: #DA0027;',
        '  --cc-btn-primary-hover-bg: #C40023;',
        '  --cc-btn-primary-hover-color: #fff;',
        '  --cc-btn-primary-hover-border-color: #C40023;',
        /* Secondary button — Reject all / Manage preferences */
        '  --cc-btn-secondary-bg: #363F47;',
        '  --cc-btn-secondary-color: #fff;',
        '  --cc-btn-secondary-border-color: #363F47;',
        '  --cc-btn-secondary-hover-bg: #242A31;',
        '  --cc-btn-secondary-hover-color: #fff;',
        '  --cc-btn-secondary-hover-border-color: #242A31;',
        /* Toggle */
        '  --cc-toggle-on-bg: #DA0027;',
        '  --cc-toggle-off-bg: #667085;',
        '  --cc-toggle-on-knob-bg: #fff;',
        '  --cc-toggle-off-knob-bg: #fff;',
        '  --cc-toggle-readonly-bg: #d5d5d5;',
        '  --cc-toggle-readonly-knob-bg: #fff;',
        /* Misc */
        '  --cc-separator-border-color: #DDDDDD;',
        '  --cc-link-color: #DA0027;',
        '  --cc-overlay-bg: rgba(0,0,0,0.65);',
        '  --cc-cookie-category-block-bg: #f5f5f5;',
        '  --cc-cookie-category-block-border: #DDDDDD;',
        '  --cc-btn-border-radius: 4px;',
        '  --cc-modal-border-radius: 8px;',
        '  --cc-pm-toggle-border-radius: 20px;',
        '  --cc-modal-transition-duration: .3s;',
        '  font-size: 14px;',
        '  z-index: 10001;',
        '}',
        '#cc-main .cm { box-shadow: 0 -4px 20px rgba(0,0,0,.15); }',
        '#cc-main .cm__title { font-weight: 700; font-size: 1.15em; }',
        '#cc-main .cm__desc { line-height: 1.6; }',
        '#cc-main .cm__btn { font-weight: 600; padding: .65em 1.4em; min-width: 140px; text-align: center; text-transform: uppercase; letter-spacing: 0; }',
        '#cc-main .pm__title { font-weight: 700; }',
        '#cc-main .pm__btn { font-weight: 600; text-transform: uppercase; }',
        '#cc-main .pm__badge { background: #DA0027; color: #fff; }',
        '#cc-main .pm__section-desc { line-height: 1.6; }'
    ].join('\n');
    document.head.appendChild(style);
})();

/**
 * Update Google consent mode v2 whenever consent state changes.
 */
function updateGtagConsent() {
    var analyticsAccepted = CookieConsent.acceptedCategory('analytics');
    var marketingAccepted = CookieConsent.acceptedCategory('marketing');

    if (typeof gtag === 'function') {
        gtag('consent', 'update', {
            'ad_storage':              marketingAccepted  ? 'granted' : 'denied',
            'ad_user_data':            marketingAccepted  ? 'granted' : 'denied',
            'ad_personalization':      marketingAccepted  ? 'granted' : 'denied',
            'analytics_storage':       analyticsAccepted  ? 'granted' : 'denied',
            'personalization_storage': marketingAccepted  ? 'granted' : 'denied'
        });
    }
}

document.addEventListener('click', function (e) {
    if (e.target.closest('[data-cookies-manager-trigger]')) {
        e.preventDefault();
        CookieConsent.showPreferences();
    }
});

// ---------------------------------------------------------------------------
// Restore consent state from cc_cookie so GTM sees the correct values.
// Runs as early as possible after the library loads.
// ---------------------------------------------------------------------------
(function () {
    try {
        var match = document.cookie.match(/(?:^|;\s*)cc_cookie=([^;]+)/);
        if (match) {
            var cc = JSON.parse(decodeURIComponent(match[1]));
            var cats = cc.categories || [];
            var analytics = cats.indexOf('analytics') > -1 ? 'granted' : 'denied';
            var marketing = cats.indexOf('marketing') > -1 ? 'granted' : 'denied';
            if (typeof gtag === 'function') {
                gtag('consent', 'update', {
                    'ad_storage':              marketing,
                    'ad_user_data':            marketing,
                    'ad_personalization':      marketing,
                    'analytics_storage':       analytics,
                    'personalization_storage': marketing
                });
            }
        }
    } catch (e) {}
})();

// ---------------------------------------------------------------------------
// Initialise CookieConsent
// ---------------------------------------------------------------------------
CookieConsent.run({

    cookie: {
        name: 'cc_cookie',
        domain: '.myq-solution.com',
        expiresAfterDays: 365
    },

    // ----- UI options -----
    guiOptions: {
        consentModal: {
            layout: "bar",
            position: "bottom",
            equalWeightButtons: true,
            flipButtons: true
        },
        preferencesModal: {
            layout: "box",
            position: "right",
            equalWeightButtons: true,
            flipButtons: true
        }
    },

    // ----- Categories -----
    categories: {
        necessary: {
            readOnly: true
        },
        analytics: {},
        marketing: {}
    },

    // ----- Callbacks -----
    onFirstConsent: function () {
        updateGtagConsent();
    },

    onChange: function () {
        updateGtagConsent();
    },

    onConsent: function () {
        updateGtagConsent();
    },

    // ----- Language / translations -----
    language: {
        default: "en",
        autoDetect: "browser",
        translations: {
            en: {
                consentModal: {
                    title: "This website uses cookies",
                    description: "We use cookies to personalise content and ads, to provide social media features and to analyse our traffic. We also share information about your use of our site with our social media, advertising and analytics partners who may combine it with other information that you\u2019ve provided to them or that they\u2019ve collected from your use of their services.",
                    closeIconLabel: "",
                    acceptAllBtn: "Accept all",
                    acceptNecessaryBtn: "Reject all",
                    showPreferencesBtn: "Manage preferences"
                },
                preferencesModal: {
                    title: "Consent Preferences Center",
                    closeIconLabel: "Close modal",
                    acceptAllBtn: "Accept all",
                    acceptNecessaryBtn: "Reject all",
                    savePreferencesBtn: "Save preferences",
                    serviceCounterLabel: "Service|Services",
                    sections: [
                        {
                            title: "Strictly Necessary Cookies <span class=\"pm__badge\">Always Enabled</span>",
                            description: "Necessary cookies help make a website usable by enabling basic functions like page navigation and access to secure areas of the website. The website cannot function properly without these cookies.",
                            linkedCategory: "necessary"
                        },
                        {
                            title: "Analytics Cookies",
                            description: "Statistic cookies help website owners to understand how visitors interact with websites by collecting and reporting information anonymously.",
                            linkedCategory: "analytics"
                        },
                        {
                            title: "Advertisement Cookies",
                            description: "Marketing cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user and thereby more valuable for publishers and third party advertisers.",
                            linkedCategory: "marketing"
                        }
                    ]
                }
            }
        }
    }
});
