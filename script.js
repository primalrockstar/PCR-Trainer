// Tab switching functionality
function showTab(tabName) {
    // Hide all tab contents
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// Save draft to localStorage
function saveDraft() {
    const formData = getFormData();
    localStorage.setItem('pcrDraft', JSON.stringify(formData));
    alert('Draft saved successfully!');
}

// Clear form
function clearForm() {
    if (confirm('Are you sure you want to clear all fields?')) {
        document.getElementById('pcr-form').reset();
        alert('Form cleared!');
    }
}

// Get form data
function getFormData() {
    const form = document.getElementById('pcr-form');
    const formData = {};
    
    // Get all form elements
    const elements = form.querySelectorAll('input, select, textarea');
    elements.forEach(element => {
        if (element.id) {
            formData[element.id] = element.value;
        }
    });
    
    return formData;
}

// Load form data
function loadFormData(data) {
    Object.keys(data).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.value = data[key];
        }
    });
}

// Review PCR
function reviewPCR() {
    const formData = getFormData();
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'review-modal';
    
    // Build review content
    let reviewHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>PCR Review</h2>
                <span class="close" onclick="closeModal()">&times;</span>
            </div>
    `;
    
    // Patient Information
    if (formData['patient-name'] || formData['patient-age'] || formData['patient-gender']) {
        reviewHTML += `
            <div class="review-section">
                <h3>Patient Information</h3>
                ${formData['patient-name'] ? `<p><strong>Name:</strong> ${formData['patient-name']}</p>` : ''}
                ${formData['patient-age'] ? `<p><strong>Age:</strong> ${formData['patient-age']}</p>` : ''}
                ${formData['patient-gender'] ? `<p><strong>Gender:</strong> ${formData['patient-gender']}</p>` : ''}
                ${formData['patient-dob'] ? `<p><strong>DOB:</strong> ${formData['patient-dob']}</p>` : ''}
                ${formData['patient-weight'] ? `<p><strong>Weight:</strong> ${formData['patient-weight']} kg</p>` : ''}
            </div>
        `;
    }
    
    // Incident Information
    if (formData['incident-date'] || formData['incident-time'] || formData['incident-location']) {
        reviewHTML += `
            <div class="review-section">
                <h3>Incident Information</h3>
                ${formData['incident-date'] ? `<p><strong>Date:</strong> ${formData['incident-date']}</p>` : ''}
                ${formData['incident-time'] ? `<p><strong>Time:</strong> ${formData['incident-time']}</p>` : ''}
                ${formData['incident-location'] ? `<p><strong>Location:</strong> ${formData['incident-location']}</p>` : ''}
            </div>
        `;
    }
    
    // Chief Complaint
    if (formData['chief-complaint']) {
        reviewHTML += `
            <div class="review-section">
                <h3>Chief Complaint</h3>
                <p>${formData['chief-complaint']}</p>
            </div>
        `;
    }
    
    // History
    if (formData['hpi'] || formData['medical-history']) {
        reviewHTML += `
            <div class="review-section">
                <h3>History</h3>
                ${formData['hpi'] ? `<p><strong>HPI:</strong> ${formData['hpi']}</p>` : ''}
                ${formData['medical-history'] ? `<p><strong>Medical History:</strong> ${formData['medical-history']}</p>` : ''}
            </div>
        `;
    }
    
    // Vital Signs
    if (formData['bp-initial'] || formData['hr-initial']) {
        reviewHTML += `
            <div class="review-section">
                <h3>Vital Signs</h3>
                <p><strong>Initial Vitals:</strong></p>
                <p>
                    ${formData['bp-initial'] ? `BP: ${formData['bp-initial']}, ` : ''}
                    ${formData['hr-initial'] ? `HR: ${formData['hr-initial']}, ` : ''}
                    ${formData['rr-initial'] ? `RR: ${formData['rr-initial']}, ` : ''}
                    ${formData['spo2-initial'] ? `SpO2: ${formData['spo2-initial']}%, ` : ''}
                    ${formData['temp-initial'] ? `Temp: ${formData['temp-initial']}°C, ` : ''}
                    ${formData['gcs-initial'] ? `GCS: ${formData['gcs-initial']}` : ''}
                </p>
            </div>
        `;
    }
    
    // Assessment
    if (formData['physical-exam'] || formData['impression']) {
        reviewHTML += `
            <div class="review-section">
                <h3>Assessment</h3>
                ${formData['physical-exam'] ? `<p><strong>Physical Exam:</strong> ${formData['physical-exam']}</p>` : ''}
                ${formData['impression'] ? `<p><strong>Impression:</strong> ${formData['impression']}</p>` : ''}
            </div>
        `;
    }
    
    // Treatment
    if (formData['treatment']) {
        reviewHTML += `
            <div class="review-section">
                <h3>Treatment</h3>
                <p>${formData['treatment']}</p>
            </div>
        `;
    }
    
    // Narrative
    if (formData['narrative']) {
        reviewHTML += `
            <div class="review-section">
                <h3>Narrative</h3>
                <p>${formData['narrative']}</p>
            </div>
        `;
    }
    
    // Disposition
    if (formData['transport'] || formData['destination']) {
        reviewHTML += `
            <div class="review-section">
                <h3>Disposition</h3>
                ${formData['transport'] ? `<p><strong>Transport:</strong> ${formData['transport']}</p>` : ''}
                ${formData['destination'] ? `<p><strong>Destination:</strong> ${formData['destination']}</p>` : ''}
            </div>
        `;
    }
    
    reviewHTML += `
            <div class="form-actions">
                <button class="btn btn-secondary" onclick="window.print()">Print</button>
                <button class="btn btn-primary" onclick="closeModal()">Close</button>
            </div>
        </div>
    `;
    
    modal.innerHTML = reviewHTML;
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('review-modal');
    if (modal) {
        modal.remove();
    }
}

// Load scenario data
function loadScenario(scenarioName) {
    const scenarios = {
        'chest-pain': {
            'patient-name': 'Smith, John A',
            'patient-age': '62',
            'patient-gender': 'Male',
            'patient-weight': '95',
            'incident-date': new Date().toISOString().split('T')[0],
            'incident-time': '14:30',
            'incident-location': '123 Main Street, residence',
            'chief-complaint': 'Patient states "I have crushing chest pain"',
            'hpi': 'Onset: Started 30 minutes ago while mowing lawn. Provocation: Worse with exertion. Quality: Crushing, pressure-like. Radiation: Radiates to left arm and jaw. Severity: 8/10. Time: Continuous for 30 minutes.',
            'medical-history': 'S: Chest pain, diaphoresis, nausea. A: Aspirin allergy. M: Lisinopril, Metoprolol. P: Hypertension, high cholesterol. L: Breakfast at 0800. E: Mowing lawn when pain started.',
            'bp-initial': '156/94',
            'hr-initial': '102',
            'rr-initial': '20',
            'spo2-initial': '94',
            'temp-initial': '37.2',
            'gcs-initial': '15',
            'physical-exam': 'General: Alert, oriented, in obvious distress. Skin: Pale, cool, diaphoretic. Chest: Clear bilaterally. Cardiovascular: Regular rhythm, no murmurs. Abdomen: Soft, non-tender.',
            'impression': 'Acute Coronary Syndrome (ACS)',
            'treatment': '14:35 - Oxygen 4L via NC, SpO2 improved to 98%. 14:37 - 324mg Aspirin PO administered (confirmed no allergy). 14:40 - 0.4mg Nitroglycerin SL administered, BP 148/88. Patient reports pain decreased to 6/10.',
            'narrative': 'Called to 62 y/o male c/o chest pain. Upon arrival, pt found sitting in lawn chair, appears in distress, pale and diaphoretic. Pt states crushing chest pain started 30 min ago while mowing lawn, radiates to L arm and jaw, 8/10 severity. PMH includes HTN and high cholesterol. Currently takes Lisinopril and Metoprolol. Denies aspirin allergy upon further questioning. Initial vitals: BP 156/94, HR 102, RR 20, SpO2 94% RA. Physical exam reveals diaphoretic, pale male with clear lung sounds bilaterally. 12-lead EKG obtained showing ST elevation in leads II, III, aVF. O2 4L NC applied, aspirin 324mg PO given, NTG 0.4mg SL administered with good effect. Pt placed on cardiac monitor, IV established 18g L AC. Transported to Regional Medical Center with lights and sirens, contacted receiving facility with report. Pt remained stable during transport with pain decreased to 4/10 after second NTG dose.',
            'transport': 'Transported to hospital',
            'destination': 'Regional Medical Center'
        },
        'fall': {
            'patient-name': 'Johnson, Mary E',
            'patient-age': '78',
            'patient-gender': 'Female',
            'patient-weight': '68',
            'incident-date': new Date().toISOString().split('T')[0],
            'incident-time': '09:15',
            'incident-location': '456 Oak Avenue, residence',
            'chief-complaint': 'Patient states "I fell and hurt my hip"',
            'hpi': 'Onset: Approximately 1 hour ago. Provocation: Pain worse with movement. Quality: Sharp pain in right hip. Radiation: Localized to hip. Severity: 7/10. Time: Since fall.',
            'medical-history': 'S: Right hip pain, unable to bear weight. A: NKDA. M: Warfarin, Alendronate, Lisinopril. P: Osteoporosis, AFib, HTN. L: Coffee at 0730. E: Tripped on rug while walking to bathroom.',
            'bp-initial': '142/86',
            'hr-initial': '88',
            'rr-initial': '18',
            'spo2-initial': '96',
            'temp-initial': '36.8',
            'gcs-initial': '15',
            'physical-exam': 'General: Alert, oriented x3. Right hip: Shortened and externally rotated right leg, tenderness to palpation over right hip, limited ROM due to pain. No open wounds. Pelvis stable. Distal neurovascular intact.',
            'impression': 'Suspected right hip fracture',
            'treatment': '09:25 - C-spine precautions maintained. 09:30 - Right leg immobilized in position found. 09:35 - Cold pack applied to right hip. 09:40 - IV access established 18g L AC. Pain management discussed, pt declined at this time.',
            'narrative': 'Called to 78 y/o female who fell at home. Found pt lying on floor in bathroom, c/o right hip pain. Pt states she tripped on bathroom rug approximately 1 hour ago and is unable to get up. Denies loss of consciousness, head strike, or other injuries. PMH includes osteoporosis, AFib, HTN. Takes Warfarin, Alendronate, Lisinopril. NKDA. Physical exam reveals classic presentation of hip fracture with shortened, externally rotated right leg. Pt alert and oriented x3. Vitals stable. C-spine precautions maintained throughout care. Right leg immobilized in position found, cold pack applied. IV established. Pt moved to stretcher using scoop stretcher with minimal movement. Transported non-emergent to City Hospital for evaluation.',
            'transport': 'Transported to hospital',
            'destination': 'City Hospital'
        },
        'respiratory': {
            'patient-name': 'Davis, Robert M',
            'patient-age': '45',
            'patient-gender': 'Male',
            'patient-weight': '88',
            'incident-date': new Date().toISOString().split('T')[0],
            'incident-time': '22:15',
            'incident-location': '789 Elm Street, Apartment 3B',
            'chief-complaint': 'Patient states "I can\'t breathe"',
            'hpi': 'Onset: Progressive over past 2 hours. Provocation: Worse when lying down. Quality: Shortness of breath with wheezing. Radiation: N/A. Severity: Severe difficulty breathing. Time: 2 hours, getting worse.',
            'medical-history': 'S: Dyspnea, wheezing, use of accessory muscles. A: Penicillin. M: Albuterol inhaler (hasn\'t worked), Advair. P: Asthma, COPD. L: Dinner at 1900. E: Gradual onset while watching TV, used inhaler 3x without relief.',
            'bp-initial': '138/82',
            'hr-initial': '118',
            'rr-initial': '32',
            'spo2-initial': '88',
            'temp-initial': '37.4',
            'gcs-initial': '15',
            'physical-exam': 'General: Alert, sitting upright, tripod position, severe respiratory distress. Respiratory: Diffuse expiratory wheezing bilaterally, decreased air movement, use of accessory muscles, speaking in 2-3 word sentences. Skin: Slightly cyanotic lips.',
            'impression': 'Acute asthma exacerbation',
            'treatment': '22:20 - High flow O2 15L via NRB mask, SpO2 improved to 92%. 22:22 - Albuterol 2.5mg via nebulizer initiated. 22:27 - Second Albuterol treatment given. 22:32 - Reassessment: RR 24, SpO2 94%, pt able to speak in 4-5 word sentences, still wheezing but improved air movement.',
            'narrative': 'Called to 45 y/o male with difficulty breathing. Upon arrival, found pt in severe respiratory distress, sitting upright in tripod position, speaking in 2-3 word sentences. Pt states progressive SOB over past 2 hours, used inhaler 3 times without relief. PMH of asthma and COPD. Takes Albuterol and Advair. Allergic to Penicillin. Initial assessment reveals diffuse wheezing, decreased air movement, use of accessory muscles. Initial vitals: RR 32, SpO2 88% RA, HR 118. Immediately placed on high flow O2 15L NRB, SpO2 improved to 92%. Albuterol 2.5mg nebulizer treatment initiated. Pt placed on cardiac monitor, IV established 18g R AC. Second nebulizer treatment given en route. Reassessment shows improvement: RR decreased to 24, SpO2 94%, pt speaking in longer sentences, wheezing persists but air movement improved. Transported to Regional Medical Center, pt remained stable during transport.',
            'transport': 'Transported to hospital',
            'destination': 'Regional Medical Center'
        },
        'diabetic': {
            'patient-name': 'Wilson, Sarah L',
            'patient-age': '35',
            'patient-gender': 'Female',
            'patient-weight': '72',
            'incident-date': new Date().toISOString().split('T')[0],
            'incident-time': '16:45',
            'incident-location': 'Public Park, near playground',
            'chief-complaint': 'Bystander states "She seems confused and is acting strange"',
            'hpi': 'Onset: Unknown, found by bystanders appearing confused. Provocation: N/A. Quality: Altered mental status, diaphoretic. Radiation: N/A. Severity: Unable to answer questions appropriately. Time: Unknown duration.',
            'medical-history': 'S: Altered mental status, diaphoresis, confusion. A: NKDA. M: Insulin (last dose this morning). P: Type 1 Diabetes. L: "I don\'t remember" per pt. E: Found confused at park.',
            'bp-initial': '124/78',
            'hr-initial': '96',
            'rr-initial': '16',
            'spo2-initial': '98',
            'temp-initial': '36.9',
            'gcs-initial': '13',
            'physical-exam': 'General: Confused, disoriented to time and place, diaphoretic, pale. Neuro: GCS 13 (E4, V4, M5), follows simple commands inconsistently. Skin: Cool, pale, diaphoretic. Blood glucose: 42 mg/dL.',
            'impression': 'Hypoglycemia',
            'treatment': '16:50 - Blood glucose check: 42 mg/dL. 16:52 - IV access established 20g R AC. 16:53 - D50W 25g (50mL) IV push administered. 16:58 - Reassessment: Pt alert and oriented x3, blood glucose 98 mg/dL. 17:00 - Oral glucose gel administered, pt given juice to drink.',
            'narrative': 'Called to public park for female with altered mental status. Upon arrival, found 35 y/o female sitting on bench, confused and diaphoretic. Bystanders state she was acting strange. Pt has medical alert bracelet indicating Type 1 Diabetes. Pt unable to provide reliable history due to confusion. Initial assessment: GCS 13, pale, cool, diaphoretic skin. Blood glucose check reveals 42 mg/dL. IV established 20g R AC. D50W 25g administered IV push. Within 5 minutes, pt became alert and oriented x3. Repeat glucose 98 mg/dL. Pt now recalls she took her insulin this morning but skipped lunch. Oral glucose gel and juice provided. Vital signs stable throughout. Pt advised to seek medical evaluation, initially refused transport. After discussion of risks and with improved mental status, pt agreed to transport for evaluation. Transported non-emergent to City Hospital. Pt remained alert and stable during transport, encouraged to eat snacks provided.',
            'transport': 'Transported to hospital',
            'destination': 'City Hospital'
        }
    };
    
    const scenario = scenarios[scenarioName];
    if (scenario) {
        loadFormData(scenario);
        showTab('practice');
        // Scroll to top of form
        window.scrollTo({ top: 0, behavior: 'smooth' });
        alert('Scenario loaded! Review the pre-filled information and complete the PCR.');
    }
}

// Load saved draft on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedDraft = localStorage.getItem('pcrDraft');
    if (savedDraft) {
        const showDraft = confirm('A saved draft was found. Would you like to load it?');
        if (showDraft) {
            loadFormData(JSON.parse(savedDraft));
        }
    }
    
    // Set current date as default for incident date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('incident-date').value = today;
});

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const modal = document.getElementById('review-modal');
    if (modal && event.target === modal) {
        closeModal();
    }
});
