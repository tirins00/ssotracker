import { useState } from 'react';
import Stepper from '../components/Stepper';
import DocumentCard from '../components/DocumentCard';
import Icon from '../components/Icon';

const DOCUMENTS = [
  { id: 1, title: 'Excuse Slip',                   desc: 'For absences due to illness, emergencies, or school-related activities.',               days: '1 day processing'  },
  { id: 2, title: 'Good Moral Certificate',         desc: 'Certifies good moral character of the student for employment, scholarship, or transfer.', days: '3 days processing' },
  { id: 3, title: 'Certificate of Good Standing',   desc: 'Confirms that the student is in good academic and disciplinary standing.',              days: '3 days processing' },
  { id: 4, title: 'Enrollment Certificate',         desc: 'Official proof of current enrollment in CIT-U.',                                       days: '2 days processing' },
  { id: 5, title: 'Indigency Certificate',          desc: 'Certifies financial need for scholarship, assistance, or exemption purposes.',          days: '2 days processing' },
  { id: 6, title: 'Scholarship Endorsement Letter', desc: 'Official endorsement for scholarship applications.',                                    days: '5 days processing' },
  { id: 7, title: 'Student Clearance',              desc: 'Required for graduation, transferring, or end-of-year completion.',                     days: '3 days processing' },
  { id: 8, title: 'Transfer Credentials',           desc: 'Official transfer documents for students transferring to another institution.',         days: '7 days processing' },
];

const STEPS = ['Select Document', 'Request Details', 'Review & Submit'];

const SubmitRequestPage = ({ showToast }) => {
  const [step,     setStep]     = useState(1);
  const [selected, setSelected] = useState(null);
  const [purpose,  setPurpose]  = useState('');
  const [notes,    setNotes]    = useState('');

  const reset = () => { setStep(1); setSelected(null); setPurpose(''); setNotes(''); };

  const handleSubmit = () => { showToast('Request submitted successfully!'); reset(); };

  return (
    <div>
      <div className="page-title">Submit Request</div>
      <div className="page-sub">Request essential documents from the SSO</div>
      <Stepper steps={STEPS} currentStep={step} />

      {step === 1 && (
        <>
          <div className="doc-grid">
            {DOCUMENTS.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} selected={selected?.id === doc.id} onSelect={setSelected} />
            ))}
          </div>
          <div className="btn-row">
            <button className="btn-next" disabled={!selected} onClick={() => setStep(2)}>
              Next Step <Icon name="chevRight" size={15} color="#fff" />
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <div className="form-card">
          <h3>Request Information</h3>
          <div className="form-group">
            <label className="form-label">Purpose of Request <span>*</span></label>
            <textarea className="form-textarea" placeholder="Please describe the purpose of your request..." value={purpose} onChange={(e) => setPurpose(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Additional Notes (Optional)</label>
            <textarea className="form-textarea" placeholder="Any additional information that may help process your request..." value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div className="btn-row">
            <button className="btn-back" onClick={() => setStep(1)}><Icon name="chevLeft" size={15} /> Back</button>
            <button className="btn-next" disabled={!purpose.trim()} onClick={() => setStep(3)}>Next Step <Icon name="chevRight" size={15} color="#fff" /></button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="review-card">
          <h3>Review & Submit</h3>
          <div className="review-row"><span className="review-label">Document Type</span><span className="review-value">{selected?.title}</span></div>
          <div className="review-row"><span className="review-label">Processing Time</span><span className="review-value">{selected?.days}</span></div>
          <div className="review-row"><span className="review-label">Purpose of Request</span><span className="review-value">{purpose}</span></div>
          {notes && <div className="review-row"><span className="review-label">Additional Notes</span><span className="review-value">{notes}</span></div>}
          <div className="btn-row" style={{ marginTop: 24 }}>
            <button className="btn-back" onClick={() => setStep(2)}><Icon name="chevLeft" size={15} /> Back</button>
            <button className="btn-next" onClick={handleSubmit}>Submit Request <Icon name="chevRight" size={15} color="#fff" /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmitRequestPage;