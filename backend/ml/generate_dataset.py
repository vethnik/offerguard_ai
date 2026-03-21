"""
OfferGuard - Pattern-Based Dataset Generator
100% pattern based — no names, no cities, no phones, no companies
Model learns ONLY from language patterns and document structure
Run: python generate_dataset.py
Output: dataset.csv
"""

import csv
import random

random.seed(42)

# ─── POSITIONS (kept generic) ───
professional_positions = [
    "Software Engineer", "Data Analyst", "Product Manager",
    "Full Stack Developer", "DevOps Engineer", "ML Engineer",
    "UI/UX Designer", "Backend Developer", "Frontend Developer",
    "Data Scientist", "Cloud Architect", "Quality Analyst",
    "Business Analyst", "Technical Lead", "Operations Analyst",
]

general_positions = [
    "Office Assistant", "Data Entry Operator", "Customer Care Executive",
    "Field Officer", "Accounts Assistant", "HR Executive",
    "Administrative Officer", "Technical Assistant", "Sales Executive",
    "Marketing Executive", "Ground Staff", "Supervisor",
]

all_positions = professional_positions + general_positions

# ─── SALARY RANGES (realistic & overlapping — salary is NOT a fraud signal) ───
all_salaries = [
    "Rs.25,000/- per month", "Rs.30,000/- per month",
    "Rs.35,000/- per month", "Rs.40,000/- per month",
    "Rs.42,000/- per month", "Rs.45,000/- per month",
    "Rs.50,000/- per month", "Rs.60,000/- per month",
    "Rs.3,60,000/- per annum", "Rs.4,80,000/- per annum",
    "Rs.6,00,000/- per annum", "Rs.7,20,000/- per annum",
    "Rs.8,50,000/- per annum", "Rs.10,00,000/- per annum",
]

legit_salaries = all_salaries
fraud_salaries = all_salaries

# ─── FRAUD AMOUNTS ───
fraud_amounts = [
    "Rs.750/-", "Rs.999/-", "Rs.1,500/-", "Rs.1,800/-",
    "Rs.1,999/-", "Rs.2,000/-", "Rs.2,500/-", "Rs.2,999/-",
    "Rs.3,000/-", "Rs.3,500/-", "Rs.3,800/-", "Rs.4,500/-",
    "Rs.4,999/-", "Rs.5,000/-", "Rs.6,000/-",
]

# ─── LEGIT EMAIL PATTERNS ───
legit_email_patterns = [
    "hr@[officialdomain]", "careers@[officialdomain]",
    "recruitment@[officialdomain]", "talent@[officialdomain]",
    "humanresources@[officialdomain]",
]

# ─── FRAUD EMAIL PATTERNS ───
fraud_email_patterns = [
    "recruitment@gmail.com", "hiring@yahoo.com",
    "hr.india@outlook.com", "jobs@hotmail.com",
    "recruitment2026@gmail.com", "noreply@yahoo.in",
    "jobsoffer@gmail.com", "hiring.india@yahoo.com",
    "offer.letter@gmail.com", "appointment@outlook.com",
    "staffing@hotmail.com", "hrteam@gmail.com",
]

# ─── JOINING DAYS ───
joining_days = ["15", "20", "30", "45", "60"]

# ─────────────────────────────────────────
# LEGITIMATE TEMPLATES
# Key patterns: professional tone, no fees,
# official email, clear structure, website
# ─────────────────────────────────────────
def generate_legit():
    position = random.choice(professional_positions)
    salary = random.choice(legit_salaries)
    days = random.choice(joining_days)
    dept = random.choice([
        "Engineering", "Technology", "Product", "Analytics",
        "Operations", "Finance", "Marketing", "Research"
    ])

    templates = [
        f"""Dear Candidate,

We are pleased to offer you the position of {position} in our {dept} department. This offer is subject to successful completion of background verification and reference checks.

Your compensation will be {salary}. A detailed breakup of your salary structure will be shared separately.

Your tentative date of joining is {days} days from the date of this letter. Please report to our HR department with your original documents including educational certificates, identity proof, and address proof.

Our benefits include health insurance, provident fund, gratuity, and performance-based incentives.

Please note that no fees, deposits, or charges of any kind are required from you at any stage of the hiring process. All work equipment will be provided by the organization on your first day.

Please sign and return a copy of this letter to confirm your acceptance. For queries, write to us at our official email address or visit our website for contact details.

We look forward to having you on board.

Regards,
Human Resources Department""",

        f"""OFFER LETTER

Subject: Offer of Employment — {position}

Dear Candidate,

With reference to your interview and subsequent discussions, we are pleased to extend this formal offer of employment for the position of {position}.

Compensation Details:
— Total Annual CTC: {salary}
— Department: {dept}
— Employment Type: Full-time, Permanent
— Joining Date: Within {days} days of acceptance

This offer is contingent upon satisfactory background verification. You will be required to submit original educational certificates, government-issued ID, and address proof at the time of joining.

Please note that no fees or security deposits are required from the candidate. This is a standard employment offer with no financial obligations on your part.

This offer is valid for 7 days from the date of issue. Kindly confirm acceptance by signing and returning this letter.

For any queries please contact us through our official website or corporate email.

Sincerely,
HR & Talent Acquisition""",

        f"""Dear [Candidate Name],

Congratulations on successfully completing our selection process! We are delighted to offer you the role of {position} within our {dept} team.

Here are the key details of your offer:
— Position: {position}
— Department: {dept}
— Compensation: {salary}
— Start Date: {days} days from acceptance
— Employment: Permanent, Full-time

Upon joining, you will receive a comprehensive employee handbook detailing all policies and benefits. Please bring originals of your mark sheets, experience certificates, PAN card, and Aadhaar card on your first day.

Important: There are absolutely no fees or charges required from you. Our organization never asks candidates to pay money at any stage of recruitment. All necessary equipment and tools will be provided at no cost.

Please respond by email or visit our official website to confirm your acceptance.

We are excited to welcome you to our team!

Best Regards,
Talent Acquisition Team""",

        f"""APPOINTMENT LETTER

Dear Candidate,

We are happy to confirm your selection for the position of {position} based on your performance in our recruitment process.

Compensation Package:
— Monthly Gross Salary: {salary}
— Department: {dept}
— Work Schedule: Monday to Friday
— Date of Joining: {days} days from the date of this letter

Benefits:
— Health insurance for self and family
— Provident fund as per government norms
— Gratuity as applicable
— Performance-based annual bonus

You will receive your employee ID, access card, and work equipment on your first day of joining. No advance payment, security deposit, or fee of any kind is required.

Please sign this letter and return a copy to our HR department to formally accept this offer.

Yours sincerely,
Human Resources""",

        f"""Hi,

We are excited to inform you that you have been selected for the position of {position} with us!

Offer Summary:
— Role: {position}
— CTC: {salary}
— Team: {dept}
— Start Date: {days} days from today

What you can expect from us:
— Health and wellness benefits
— Flexible work arrangements
— Learning and development budget
— Collaborative and inclusive work culture

What we need from you:
— Signed copy of this offer letter
— Original documents for background verification on Day 1

No fees or deposits of any kind are required. We provide all necessary equipment and tools from Day 1.

Please reply to this letter or reach out through our official website to confirm your joining.

Looking forward to working with you!

HR Team""",

        f"""LETTER OF INTENT

Dear Candidate,

Following your successful interview for the role of {position}, we are pleased to confirm our intent to offer you employment with our organization.

Key Terms:
Position: {position}
Department: {dept}
Gross Compensation: {salary}
Probation Period: 6 months
Notice Period: 30 days after confirmation

During the probation period, your performance will be reviewed quarterly. Upon successful completion, you will be confirmed as a permanent employee with full benefits.

No financial contribution is required from you at any point. Background verification will be conducted at our cost.

Please acknowledge receipt and acceptance of this letter within 5 working days.

Regards,
HR Department""",
    ]
    return random.choice(templates)


# ─────────────────────────────────────────
# FRAUD TEMPLATES
# Key patterns: fee requests, urgency,
# free email domains, refund promises,
# vague organization, pressure tactics
# ─────────────────────────────────────────
def generate_fraud():
    position = random.choice(all_positions)
    salary = random.choice(fraud_salaries)
    amount = random.choice(fraud_amounts)
    email = random.choice(fraud_email_patterns)
    fraud_type = random.randint(1, 10)

    if fraud_type == 1:
        return f"""Dear Candidate,

We are pleased to inform you that you have been selected for the position of {position} after reviewing your profile from our database.

Your monthly salary will be {salary} with additional allowances and benefits.

IMPORTANT: To confirm your slot and process your joining formalities, you are required to pay a Welcome Kit Security Amount of {amount}. This amount is fully refundable at the time of physical verification through authority cheque.

Your welcome kit will include laptop, mobile phone, SIM card, internet dongle, and uniform. The kit will be handed over after physical verification.

Please send the security amount via UPI or bank transfer immediately to confirm your appointment. Slots are limited and allocated on first come first served basis.

Contact: {email}

Respond immediately to secure your position.

Authorized Signature
HR Department"""

    elif fraud_type == 2:
        return f"""APPOINTMENT LETTER

Dear Selected Candidate,

Congratulations! You have been shortlisted for the post of {position} through our national recruitment drive.

Salary: {salary}
Benefits: PF, ESI, Medical Insurance, Accommodation

To process your appointment and complete documentation, a one-time processing fee of {amount} is required. This is a mandatory compliance fee and is non-refundable.

Payment must be made within 24 hours to secure your appointment. Failure to pay will result in cancellation of your offer and the position will be given to the next candidate on the waiting list.

Send payment confirmation to: {email}
UPI payment accepted.

Act fast — Limited positions available!

HR Department"""

    elif fraud_type == 3:
        return f"""JOB OFFER NOTIFICATION

Dear Applicant,

We are happy to inform you that your application has been approved for the post of {position}. Your selection is based on your qualifications found in our database.

Monthly Salary: {salary}

Important Notice: A registration fee of {amount} must be deposited to confirm your candidature. This fee covers administrative and documentation charges. Please deposit immediately via NEFT or UPI.

Contact us urgently at {email} with payment confirmation.

Joining date will be confirmed after receipt of registration fee. Please respond within 24 hours as slots are limited and will be allocated to next candidates.

Recruitment Cell"""

    elif fraud_type == 4:
        return f"""Dear Candidate,

We are pleased to offer you the position of {position} at our organization.

Before joining, you will undergo a mandatory training program of 30 days. During training you will receive a stipend of Rs.15,000/- per month. After successful completion your monthly salary will be {salary}.

Training Fee: A training fee of {amount} is required before commencement of training. This amount is fully adjustable against your first month salary.

Please send the training fee immediately to confirm your seat as we have limited training batches. Contact {email} urgently.

Respond immediately to confirm your joining.

HR Department"""

    elif fraud_type == 5:
        return f"""OFFER OF APPOINTMENT

Dear Candidate,

You have been selected through our recruitment process for the post of {position}. This is a permanent position with all applicable benefits.

Pay: {salary}
Benefits: DA, HRA, TA, Medical Allowance

To complete your appointment process and obtain your employee ID, you must submit a security deposit of {amount} which will be refunded after 6 months of service through cheque.

This is urgent — please contact {email} immediately with your payment confirmation and documents.

Act fast — limited vacancies are available. Do not delay as seats are being filled rapidly.

Recruitment Authority"""

    elif fraud_type == 6:
        return f"""CONGRATULATIONS!!!

Dear Lucky Candidate,

Your profile has been shortlisted from our database for the position of {position}. You may not have applied for this position but our HR team found your profile suitable.

Package Details:
Salary: {salary}
Joining Bonus: Rs.50,000/-
Accommodation: Provided
Food: Free

To process your offer letter and appointment documents, kindly deposit a courier and documentation charge of {amount} immediately. This is a one-time non-refundable charge.

You must respond within 24 hours or your offer will be cancelled and given to the next candidate.

Send payment confirmation to: {email}

Do not miss this golden opportunity!

Recruitment Team"""

    elif fraud_type == 7:
        return f"""Dear Candidate,

We found your profile and believe you are a perfect fit for the position of {position} at our organization.

This is an urgent requirement and we need someone to join immediately. Your monthly salary will be {salary} along with accommodation and food facilities.

To initiate your joining process, you need to pay a refundable security deposit of {amount} via UPI or bank transfer. This will be returned to you on your first day of joining via company cheque.

This is time sensitive. We have multiple candidates in pipeline and your slot will be given to the next candidate if we do not receive payment confirmation within 24 hours.

Contact immediately: {email}

Urgent response required!

HR Recruitment Team"""

    elif fraud_type == 8:
        return f"""JOB CONFIRMATION LETTER

Dear Candidate,

After reviewing your application and conducting telephonic interview, we are pleased to confirm your selection for the post of {position}.

Salary: {salary}
Joining: Immediate

As part of our onboarding process, candidates are required to pay a verification and documentation fee of {amount}. This fee is used to process your background verification, police clearance certificate, and other official documentation.

Kindly transfer the amount via UPI or NEFT. Upon receipt of payment, your offer letter and joining date will be confirmed within 24 hours.

For payment and queries contact: {email}

Respond urgently. Limited vacancies remaining.

Recruitment Division"""

    elif fraud_type == 9:
        return f"""SELECTED CANDIDATE NOTICE

Dear Applicant,

We are pleased to inform you that you have cleared all rounds of our selection process for the position of {position}.

Salary Package: {salary}
Additional Benefits: Accommodation, Travel Allowance, Food

Before we can release your formal appointment letter and employee ID, a one-time refundable caution deposit of {amount} is required. This is standard procedure for all new joinings and will be returned along with your first salary.

Please make the payment immediately and share confirmation to {email} to receive your appointment letter within 24 hours.

Seats are filling up fast. Act now to secure your position.

Selection Committee"""

    else:
        return f"""URGENT JOB OFFER

Dear Candidate,

You have been urgently selected for the position of {position} based on your profile. We need someone to join immediately and your profile matches our requirement.

Salary: {salary}
Joining: Within 7 days
Benefits: PF, ESI, Accommodation

Important: To block your seat and initiate the joining process, a fully refundable security deposit of {amount} must be paid via UPI immediately. This amount will be refunded on your first working day through bank transfer.

This offer expires within 24 hours. If we do not receive your payment confirmation, we will move to the next candidate on our shortlist.

Pay now and confirm at: {email}

Hurry — Act fast!

Urgent Hiring Team"""


# ─── GENERATE ───
print("Generating 100% pattern-based dataset...")
print("No company names | No HR names | No cities | No phone numbers")
print("-" * 60)

rows = []

for _ in range(700):
    rows.append({"text": generate_legit().strip(), "label": 0})

for _ in range(700):
    rows.append({"text": generate_fraud().strip(), "label": 1})

# ─── EDGE CASES (harder samples) ───

# Legit offers that mention money/urgency (NOT fraud)
legit_edge_cases = [
    """Dear Candidate,

We are pleased to offer you the position of Software Engineer. Your salary will be credited to your bank account on the last working day of every month.

Please respond within 7 days to confirm acceptance. This offer will expire after 7 days.

No fees or deposits are required. All equipment provided on Day 1.

Regards,
HR Department""",

    """OFFER LETTER

Dear Candidate,

Congratulations on your selection for the role of Data Analyst.

Please note that your first month salary will be paid after 45 days as per our standard payroll cycle. There is no joining fee or security deposit required from your end.

Kindly confirm acceptance within 5 working days by signing and returning this letter.

HR Team""",

    """Dear Candidate,

This is to confirm your selection for the position of Product Manager.

Your compensation includes a base salary, performance bonus, and stock options. The salary will be transferred directly to your bank account monthly.

Please submit your bank account details, PAN card, and Aadhaar card on your joining day. No advance payment is required from you.

We look forward to you joining our team.

Human Resources""",

    """Hi,

Quick update — we have finalized your offer for the Backend Developer role!

We need your confirmation urgently as we have a project starting soon and need you onboard. Please respond by end of this week.

Salary: Rs.8,50,000/- per annum
Start Date: 15 days from acceptance

No fees involved. Laptop and equipment provided from Day 1.

Thanks,
HR Team""",

    """APPOINTMENT CONFIRMATION

Dear Candidate,

We are happy to confirm your appointment as Quality Analyst effective from the date mentioned below.

Your salary will be processed through NEFT transfer to your registered bank account every month. Please ensure your bank details are submitted during onboarding.

There are no charges, fees, or deposits required from you at any point during or after the hiring process.

HR Department""",

    """Dear Candidate,

We are excited to have you join as our ML Engineer!

A few things to note before joining:
- Bring your original documents for verification
- Your salary account will be opened with our partner bank at no cost to you
- All relocation expenses will be reimbursed by the organization

Please confirm joining within 3 days as the project timeline is tight.

No fees of any kind are required from candidates.

Talent Team""",
]

# Fraud offers that look legitimate at first glance (subtle scams)
fraud_edge_cases = [
    """Dear Candidate,

Greetings! After reviewing your profile, we are pleased to inform you of your selection for the position of Data Entry Operator.

Your monthly salary will be Rs.30,000/- per month along with ESI and PF benefits.

As part of our standard onboarding procedure, all selected candidates are required to submit a refundable caution deposit of Rs.2,500/- before the joining date. This deposit is returned in full after completion of 3 months of service.

Please transfer the deposit amount at the earliest and send confirmation to recruitment@gmail.com to receive your formal appointment letter.

HR Department""",

    """OFFER LETTER

Dear Applicant,

We are delighted to inform you that you have been shortlisted for the role of Office Assistant based on your qualifications.

Compensation: Rs.25,000/- per month
Benefits: ESI, PF, Medical

Kindly note that to initiate your background verification and documentation process, a nominal fee of Rs.1,800/- is applicable. This is a one-time charge covering police verification and document attestation costs.

Please contact us at hiring@yahoo.com to proceed with payment and confirm your joining date.

Sincerely,
Recruitment Team""",

    """Dear Candidate,

Congratulations on clearing our selection process for the post of Customer Care Executive!

Your salary package is Rs.28,000/- per month with growth opportunities.

We would like to inform you that all new joiners are required to pay a uniform and ID card fee of Rs.999/- at the time of joining. This is a standard onboarding requirement and is non-refundable.

Please confirm your acceptance and payment details at jobs@hotmail.com at the earliest as we have limited openings.

Best Regards,
HR Team""",

    """SELECTION CONFIRMATION

Dear Candidate,

This is to inform you that your application for the post of Field Officer has been accepted.

Salary: Rs.35,000/- per month + travel allowance

As per our policy, all selected candidates must complete a document verification process before joining. A verification processing charge of Rs.1,500/- is required to initiate this process. The amount will be adjusted in your first salary.

Contact hr.india@outlook.com to submit payment and schedule your joining date.

Do confirm at the earliest as positions are limited.

Selection Committee""",

    """Dear Applicant,

We are pleased to offer you the role of Administrative Officer at our organization.

Your CTC will be Rs.4,80,000/- per annum with all statutory benefits.

Please note that as part of our security protocol, all new employees are required to submit a refundable security deposit of Rs.3,000/- which will be returned upon completion of your probation period of 6 months.

Kindly transfer the amount and send confirmation to staffing@hotmail.com within 48 hours to block your position.

Regards,
HR Division""",

    """URGENT — Job Offer Confirmation Required

Dear Candidate,

Following your recent interview, we are pleased to confirm your selection for the position of Sales Executive.

Package: Rs.40,000/- per month + incentives + travel allowance

This is an urgent communication as we need to fill this position immediately. Please confirm your acceptance within 24 hours.

Additionally, all new joiners are required to pay a nominal background check fee of Rs.2,000/- to our empanelled verification agency. Contact noreply@yahoo.in with payment confirmation to receive your appointment letter.

HR Team""",
]

for text in legit_edge_cases:
    rows.append({"text": text.strip(), "label": 0})

for text in fraud_edge_cases:
    rows.append({"text": text.strip(), "label": 1})

random.shuffle(rows)

with open("dataset.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["text", "label"])
    writer.writeheader()
    writer.writerows(rows)

legit_count = sum(1 for r in rows if r["label"] == 0)
fraud_count = sum(1 for r in rows if r["label"] == 1)

print(f"\n✅ Dataset generated successfully!")
print(f"   Total samples : {len(rows)}")
print(f"   Legitimate    : {legit_count} (including {len(legit_edge_cases)} edge cases)")
print(f"   Fraud         : {fraud_count} (including {len(fraud_edge_cases)} subtle scams)")
print(f"   Saved to      : dataset.csv")
print(f"\nModel will learn PATTERNS not identifiers!")
