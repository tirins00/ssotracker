import { useState } from 'react';
import Icon from '../components/Icon';

const FAQ_DATA = [
  { q: 'How do I submit a document request?', a: 'Navigate to "Submit Request" from the sidebar, select your desired document type, fill in the request details, and confirm your submission. You will receive a notification once it is processed.' },
  { q: 'How long does processing take?', a: 'Processing times vary by document. Excuse slips typically take 1 day, while Transfer Credentials can take up to 7 days. Each document card shows its estimated processing time.' },
  { q: 'Can I cancel a submitted request?', a: 'Yes, you can cancel a request while it is still in "Pending" status. Go to Track Requests, find your request, and click the cancel option.' },
  { q: 'What happens after I submit a request?', a: 'Your request will be reviewed by the SSO staff. You will receive notifications at each step: Pending -> In Review -> Processing -> Completed. You can also check status under Track Requests.' },
  { q: 'How will I receive my document?', a: 'Once your request is marked Completed, you will be notified to pick up your document at the SSO office, or it may be delivered digitally depending on the document type.' },
];

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);
  return (
    <div>
      <div className="page-title">Frequently Asked Questions</div>
      <div className="page-sub">Find answers to common questions about the SSO Request Tracker</div>
      <div className="faq-list">
        {FAQ_DATA.map((item, i) => (
          <div className="faq-item" key={i}>
            <div className="faq-question" onClick={() => toggle(i)}>
              {item.q}
              <Icon name={openIndex === i ? 'chevUp' : 'chevDown'} size={16} color="#888" />
            </div>
            {openIndex === i && <div className="faq-answer">{item.a}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;