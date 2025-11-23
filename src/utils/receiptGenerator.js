import jsPDF from 'jspdf'

export const generatePurchaseReceipt = (purchase, product, seller) => {
  const pdf = new jsPDF()
  
  // Set font
  pdf.setFont('helvetica')
  
  // Header
  pdf.setFontSize(24)
  pdf.setTextColor(40, 116, 240) // Blue color
  pdf.text('RECEIPT', 20, 30)
  
  // Company Info
  pdf.setFontSize(12)
  pdf.setTextColor(0, 0, 0)
  pdf.text('Superlinks.ai', 20, 45)
  pdf.text('Digital Product Marketplace', 20, 52)
  pdf.text('support@superlinks.ai', 20, 59)
  
  // Receipt Info (Right side)
  pdf.text(`Receipt #: ${purchase.purchaseId}`, 120, 45)
  pdf.text(`Date: ${new Date(purchase.createdAt).toLocaleDateString()}`, 120, 52)
  pdf.text(`Status: ${purchase.status.toUpperCase()}`, 120, 59)
  
  // Line separator
  pdf.setLineWidth(0.5)
  pdf.line(20, 70, 190, 70)
  
  // Bill To
  pdf.setFontSize(14)
  pdf.setTextColor(60, 60, 60)
  pdf.text('BILL TO:', 20, 85)
  
  pdf.setFontSize(12)
  pdf.setTextColor(0, 0, 0)
  pdf.text(`${purchase.buyer.name}`, 20, 95)
  pdf.text(`${purchase.buyer.email}`, 20, 102)
  if (purchase.buyer.country) {
    pdf.text(`${purchase.buyer.country}`, 20, 109)
  }
  
  // Sold By
  pdf.setFontSize(14)
  pdf.setTextColor(60, 60, 60)
  pdf.text('SOLD BY:', 120, 85)
  
  pdf.setFontSize(12)
  pdf.setTextColor(0, 0, 0)
  pdf.text(`${seller?.name || 'Seller'}`, 120, 95)
  pdf.text(`${seller?.email || 'seller@example.com'}`, 120, 102)
  
  // Product Details Section
  pdf.setLineWidth(0.5)
  pdf.line(20, 120, 190, 120)
  
  pdf.setFontSize(14)
  pdf.setTextColor(60, 60, 60)
  pdf.text('PRODUCT DETAILS:', 20, 135)
  
  // Product table header
  pdf.setFillColor(245, 245, 245)
  pdf.rect(20, 145, 170, 10, 'F')
  
  pdf.setFontSize(10)
  pdf.setTextColor(0, 0, 0)
  pdf.text('DESCRIPTION', 25, 152)
  pdf.text('QTY', 140, 152)
  pdf.text('AMOUNT', 165, 152)
  
  // Product details
  pdf.setFontSize(11)
  const productTitle = product?.title || 'Digital Product'
  const truncatedTitle = productTitle.length > 40 ? productTitle.substring(0, 37) + '...' : productTitle
  pdf.text(truncatedTitle, 25, 165)
  pdf.text('1', 145, 165)
  pdf.text(`${purchase.currency} ${purchase.amount.toFixed(2)}`, 160, 165)
  
  // Pricing breakdown
  pdf.setLineWidth(0.5)
  pdf.line(20, 175, 190, 175)
  
  const subtotal = purchase.originalPrice || purchase.amount
  const discount = subtotal - purchase.amount
  
  pdf.setFontSize(11)
  pdf.text('Subtotal:', 140, 190)
  pdf.text(`${purchase.currency} ${subtotal.toFixed(2)}`, 160, 190)
  
  if (discount > 0) {
    pdf.text('Discount:', 140, 200)
    pdf.text(`-${purchase.currency} ${discount.toFixed(2)}`, 160, 200)
  }
  
  if (purchase.fees?.total > 0) {
    pdf.text('Processing Fee:', 140, 210)
    pdf.text(`${purchase.currency} ${purchase.fees.total.toFixed(2)}`, 160, 210)
  }
  
  // Total
  pdf.setLineWidth(1)
  pdf.line(140, 220, 190, 220)
  
  pdf.setFontSize(14)
  pdf.setTextColor(40, 116, 240)
  pdf.text('TOTAL:', 140, 235)
  pdf.text(`${purchase.currency} ${purchase.amount.toFixed(2)}`, 160, 235)
  
  // Payment Information
  pdf.setFontSize(12)
  pdf.setTextColor(0, 0, 0)
  pdf.text('Payment Information:', 20, 255)
  
  pdf.setFontSize(10)
  pdf.text(`Payment Method: ${purchase.payment?.method || 'Online Payment'}`, 20, 265)
  if (purchase.payment?.transactionId) {
    pdf.text(`Transaction ID: ${purchase.payment.transactionId}`, 20, 272)
  }
  
  // Footer
  pdf.setLineWidth(0.5)
  pdf.line(20, 285, 190, 285)
  
  pdf.setFontSize(8)
  pdf.setTextColor(100, 100, 100)
  pdf.text('Thank you for your purchase!', 20, 295)
  pdf.text('For support, contact us at support@superlinks.ai', 20, 301)
  pdf.text('This is an electronic receipt. No signature required.', 20, 307)
  
  return pdf
}

export const downloadReceipt = async (purchase, product, seller) => {
  try {
    const pdf = generatePurchaseReceipt(purchase, product, seller)
    
    // Generate filename
    const filename = `receipt-${purchase.purchaseId}-${new Date().toISOString().split('T')[0]}.pdf`
    
    // Download the PDF
    pdf.save(filename)
    
    return { success: true, filename }
  } catch (error) {
    console.error('Error generating receipt:', error)
    throw new Error('Failed to generate receipt')
  }
}