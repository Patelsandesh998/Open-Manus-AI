import React, { useState } from "react";
import { Check, Calendar, Zap } from "lucide-react";

interface Feature {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text: string;
  strikethrough?: boolean;
  link?: string;
  badge?: string;
}

interface Plan {
  name: string;
  badge?: string;
  monthlyPrice: number;
  description: string;
  isCurrent?: boolean;
  isBestValue?: boolean;
  features: Feature[];
}

const PricingPage: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState<boolean>(true);

  const plans: Plan[] = [
    {
      name: "Free",
      monthlyPrice: 0,
      description: "Try Nava AI",
      isCurrent: true,
      features: [
        { icon: Check, text: "Access to Chat mode" },
        { icon: Zap, text: "1 concurrent task", strikethrough: true },
        { icon: Calendar, text: "1 scheduled task", strikethrough: true },
      ],
    },
    {
      name: "Basic",
      badge: "Beta",
      monthlyPrice: 300,
      description: "More access to advanced features",
      features: [
        { icon: Check, text: "300 refresh credits everyday" },
        { icon: Check, text: "1,900 credits per month", link: "Learn more" },
        { icon: Calendar, text: "+1,900 extra credits per month", badge: "LIMITED OFFER" },
        { icon: Check, text: "Unlimited access to Chat mode" },
        { icon: Check, text: "Use advanced models in Agent mode" },
        { icon: Zap, text: "2 concurrent tasks" },
        { icon: Calendar, text: "2 scheduled tasks" },
        { icon: Check, text: "Slides, image and video generation" },
        { icon: Check, text: "Wide Research" },
      ],
    },
    {
      name: "Plus",
      badge: "Beta",
      monthlyPrice: 470,
      description: "Extended usage for everyday productivity",
      features: [
        { icon: Check, text: "300 refresh credits everyday" },
        { icon: Check, text: "3,900 credits per month", link: "Learn more" },
        { icon: Calendar, text: "+3,900 extra credits per month", badge: "LIMITED OFFER" },
        { icon: Check, text: "Unlimited access to Chat mode" },
        { icon: Check, text: "Use advanced models in Agent mode" },
        { icon: Zap, text: "3 concurrent tasks" },
        { icon: Calendar, text: "3 scheduled tasks" },
        { icon: Check, text: "Slides, image and video generation" },
        { icon: Check, text: "Wide Research" },
      ],
    },
    {
      name: "Pro",
      badge: "Beta",
      monthlyPrice: 650,
      description: "Full access for professional productivity",
      isBestValue: true,
      features: [
        { icon: Check, text: "300 refresh credits everyday" },
        { icon: Check, text: "19,900 credits per month", link: "Learn more" },
        { icon: Calendar, text: "+19,900 extra credits per month", badge: "LIMITED OFFER" },
        { icon: Check, text: "Unlimited access to Chat mode" },
        { icon: Check, text: "Use advanced models in Agent mode" },
        { icon: Zap, text: "10 concurrent tasks" },
        { icon: Calendar, text: "10 scheduled tasks" },
        { icon: Check, text: "Slides, image and video generation" },
        { icon: Check, text: "Wide Research" },
        { icon: Check, text: "Early access to beta features" },
      ],
    },
  ];

  const getPrice = (monthlyPrice: number): number => {
    if (monthlyPrice === 0) return 0;
    return isAnnual ? Math.round(monthlyPrice * 0.83) : monthlyPrice;
  };

  const handleCheckout = (plan: Plan) => {
    if (plan.monthlyPrice === 0) {
      alert("You're already on the Free plan!");
      return;
    }

    const amount = getPrice(plan.monthlyPrice) * 100; // Convert to paise

    const options = {
      key: 'rzp_test_5NFOiDIrADrIHb', // 🔒 Replace with your Razorpay key
      amount,
      currency: "INR",
      name: "Nava AI",
      description: `Upgrade to ${plan.name} Plan`,
      image: "/logo.png", // optional
      handler: function (response: any) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        // TODO: send this payment info to your backend to verify and upgrade user
      },
      prefill: {
        name: "John Doe",
        email: "user@example.com",
        contact: "9999999999",
      },
      notes: {
        plan_name: plan.name,
      },
      theme: {
        color: "#3b82f6",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };


  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #1a1a1a, #000000)",
        color: "white",
        padding: "48px 16px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <h1
          style={{
            fontSize: "48px",
            fontWeight: "600",
            textAlign: "center",
            marginBottom: "32px",
            color: "#ffffff",
          }}
        >
          Upgrade your plan for more credits
        </h1>

        {/* Toggle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "48px" }}>
          <div
            style={{
              background: "#2a2a2a",
              borderRadius: "8px",
              padding: "4px",
              display: "inline-flex",
            }}
          >
            <button
              onClick={() => setIsAnnual(false)}
              style={{
                padding: "8px 24px",
                borderRadius: "6px",
                background: !isAnnual ? "#3a3a3a" : "transparent",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                transition: "all 0.3s",
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              style={{
                padding: "8px 24px",
                borderRadius: "6px",
                background: isAnnual ? "#3a3a3a" : "transparent",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                transition: "all 0.3s",
              }}
            >
              Annually{" "}
              <span style={{ color: "#3b82f6", marginLeft: "4px" }}>Save 17%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
            maxWidth: "1400px",
          }}
        >
          {plans.map((plan, index) => (
            <div
              key={index}
              style={{
                borderRadius: "16px",
                padding: "24px",
                background: plan.isBestValue
                  ? "linear-gradient(to bottom, rgba(30, 58, 138, 0.4), #1a1a1a)"
                  : "rgba(42, 42, 42, 0.5)",
                border: plan.isBestValue ? "2px solid #3b82f6" : "none",
                position: "relative",
                minHeight: "650px",
              }}
            >
              {plan.isBestValue && (
                <div
                  style={{
                    position: "absolute",
                    top: "-16px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#3b82f6",
                    color: "white",
                    fontSize: "12px",
                    padding: "4px 16px",
                    borderRadius: "20px",
                    fontWeight: "600",
                  }}
                >
                  BEST VALUE
                </div>
              )}

              {/* Plan Header */}
              <div style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <h2 style={{ fontSize: "24px", fontWeight: "600", margin: 0 }}>
                    {plan.name}
                  </h2>
                  {plan.badge && (
                    <span
                      style={{
                        background: "#3a3a3a",
                        color: "#9ca3af",
                        fontSize: "12px",
                        padding: "2px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      {plan.badge}
                    </span>
                  )}
                </div>
                <div style={{ marginBottom: "8px" }}>
                  <span style={{ fontSize: "48px", fontWeight: "700" }}>
                    ₹{getPrice(plan.monthlyPrice)}
                  </span>
                  <span
                    style={{ color: "#9ca3af", marginLeft: "4px", fontSize: "14px" }}
                  >
                    / month
                    {isAnnual && plan.monthlyPrice > 0 ? ", billed yearly" : ""}
                  </span>
                </div>
                <p style={{ color: "#9ca3af", fontSize: "14px", margin: 0 }}>
                  {plan.description}
                </p>
              </div>

              {/* CTA Button */}
              <button
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  marginBottom: "24px",
                  fontWeight: "500",
                  border: "none",
                  cursor: plan.isCurrent ? "default" : "pointer",
                  background: plan.isCurrent
                    ? "#3a3a3a"
                    : plan.isBestValue
                      ? "#3b82f6"
                      : "white",
                  color: plan.isCurrent
                    ? "#9ca3af"
                    : plan.isBestValue
                      ? "white"
                      : "black",
                  fontSize: "16px",
                  transition: "all 0.3s",
                }}
                onClick={() => !plan.isCurrent && handleCheckout(plan)}
                onMouseEnter={(e) => {
                  if (!plan.isCurrent) e.currentTarget.style.opacity = "0.9";
                }}
                onMouseLeave={(e) => {
                  if (!plan.isCurrent) e.currentTarget.style.opacity = "1";
                }}
              >
                {plan.isCurrent ? "Current plan" : `Upgrade to ${plan.name}`}
              </button>


              {/* Features */}
              <div>
                {plan.features.map((feature, idx) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        marginBottom: "12px",
                      }}
                    >
                      <Icon
                        style={{
                          width: "20px",
                          height: "20px",
                          color: "#10b981",
                          flexShrink: 0,
                          marginTop: "2px",
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <span
                          style={{
                            fontSize: "14px",
                            color: feature.strikethrough ? "#6b7280" : "#d1d5db",
                            textDecoration: feature.strikethrough
                              ? "line-through"
                              : "none",
                          }}
                        >
                          {feature.text}
                        </span>
                        {feature.link && (
                          <a
                            href="#"
                            style={{
                              color: "#3b82f6",
                              fontSize: "12px",
                              marginLeft: "4px",
                              textDecoration: "none",
                            }}
                          >
                            {feature.link}
                          </a>
                        )}
                        {feature.badge && (
                          <span
                            style={{
                              display: "block",
                              fontSize: "11px",
                              color: "#6b7280",
                              marginTop: "4px",
                            }}
                          >
                            {feature.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
