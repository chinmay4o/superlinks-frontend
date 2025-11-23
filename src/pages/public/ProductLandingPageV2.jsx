import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import * as Collapsible from "@radix-ui/react-collapsible";
import {
  Star,
  Download,
  Eye,
  ShoppingCart,
  Share2,
  Check,
  X,
  Heart,
  FileText,
  Archive,
  Image as ImageIcon,
  Music,
  Video,
  Code,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  User,
  Calendar,
  Globe,
  MessageCircle,
  HelpCircle,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Facebook,
} from "lucide-react";
import { toast } from "react-hot-toast";
import reviewService from "../../services/reviewService";
import productService from "../../services/productService";
import { ProductLandingSkeleton } from "../../components/ui/product-skeleton";
import { FilePreviewModal } from "../../components/ui/file-preview-modal";

export function ProductLandingPageV2({
  mockProduct = null,
  mockReviews = null,
  mockReviewsSummary = null,
  isPreview = false,
  previewMode = 'desktop',
}) {
  const { slug, username, productSlug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(mockProduct);
  const [loading, setLoading] = useState(!isPreview);
  const [error, setError] = useState(null);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [reviews, setReviews] = useState(mockReviews || []);
  const [reviewsSummary, setReviewsSummary] = useState(
    mockReviewsSummary || { totalReviews: 0, averageRating: 0 }
  );
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Determine which slug and API endpoint to use
  const actualSlug = slug || productSlug;
  const isUserProduct = Boolean(username && productSlug);

  // Fetch product data
  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let data;
      if (isUserProduct) {
        data = await productService.getPublicProduct(username, productSlug);
      } else {
        data = await productService.getProductBySlug(actualSlug);
      }

      setProduct(data.product);

      // Fetch reviews
      if (data.product?._id) {
        try {
          const reviewsData = await reviewService.getProductReviews(
            data.product._id,
            {
              page: 1,
              limit: 5,
              sortBy: "newest",
            }
          );
          setReviews(reviewsData.reviews || []);
          setReviewsSummary(
            reviewsData.summary || { totalReviews: 0, averageRating: 0 }
          );
        } catch (err) {
          console.error("Error fetching reviews:", err);
        }
      }
    } catch (err) {
      setError(err.message || "Product not found");
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  }, [actualSlug, username, productSlug, isUserProduct]);

  useEffect(() => {
    if (isPreview) {
      // Preview mode: Use mock data, skip API calls
      setLoading(false);
      return;
    }

    if (actualSlug) {
      fetchProduct();
    }
  }, [fetchProduct, actualSlug, isPreview]);

  const handlePurchase = () => {
    if (!product || isPreview) return;
    navigate(`/checkout/${product._id}`);
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.share({
        title: product.title,
        text:
          product.shortDescription || product.description?.substring(0, 100),
        url: url,
      });
    } catch (err) {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  const formatPrice = (amount, currency = "INR") => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getFileIcon = (fileName) => {
    const extension = fileName?.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />;
      case "zip":
      case "rar":
        return <Archive className="h-4 w-4 text-orange-500" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <ImageIcon className="h-4 w-4 text-green-500" />;
      case "mp3":
      case "wav":
        return <Music className="h-4 w-4 text-purple-500" />;
      case "mp4":
      case "avi":
        return <Video className="h-4 w-4 text-blue-500" />;
      case "js":
      case "html":
      case "css":
        return <Code className="h-4 w-4 text-yellow-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const getSocialIcon = (platform) => {
    const iconProps = { className: "h-4 w-4" };
    switch (platform.toLowerCase()) {
      case 'twitter':
        return <Twitter {...iconProps} />;
      case 'linkedin':
        return <Linkedin {...iconProps} />;
      case 'instagram':
        return <Instagram {...iconProps} />;
      case 'youtube':
        return <Youtube {...iconProps} />;
      case 'facebook':
        return <Facebook {...iconProps} />;
      default:
        return <ExternalLink {...iconProps} />;
    }
  };

  const getThemeStyles = (themeStyle) => {
    const themes = {
      dawn: {
        primary: 'bg-orange-500 hover:bg-orange-600 text-white',
        background: 'bg-orange-50',
        border: 'border-orange-200',
        accent: 'text-orange-600',
        hover: 'hover:text-orange-600'
      },
      dusk: {
        primary: 'bg-purple-500 hover:bg-purple-600 text-white',
        background: 'bg-purple-50',
        border: 'border-purple-200',
        accent: 'text-purple-600',
        hover: 'hover:text-purple-600'
      },
      default: {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        background: 'bg-gray-50',
        border: 'border-gray-200',
        accent: 'text-blue-600',
        hover: 'hover:text-blue-600'
      }
    };
    return themes[themeStyle] || themes.default;
  };

  // Meta Pixel and Google Analytics tracking
  useEffect(() => {
    if (isPreview) return;
    
    // Meta Pixel tracking
    if (product?.tracking?.metaPixel && typeof window !== 'undefined') {
      if (!window.fbq) {
        const script = document.createElement('script');
        script.innerHTML = `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
        `;
        document.head.appendChild(script);
        
        window.fbq('init', product.tracking.metaPixel);
        window.fbq('track', 'PageView');
      }
    }
    
    // Google Analytics tracking
    if (product?.tracking?.googleAnalytics && typeof window !== 'undefined') {
      if (!window.gtag) {
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${product.tracking.googleAnalytics}`;
        document.head.appendChild(script1);
        
        const script2 = document.createElement('script');
        script2.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${product.tracking.googleAnalytics}');
        `;
        document.head.appendChild(script2);
        
        window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
      }
    }
  }, [product?.tracking, isPreview]);

  const handleFileClick = (file, index) => {
    setSelectedFileIndex(index);
    setSelectedFile(file);
    setIsFileModalOpen(true);
  };

  const handleFileDownload = (file) => {
    if (file.url) {
      window.open(file.url, "_blank");
      toast.success("Download started");
    } else {
      toast.error("File not available for download");
    }
  };

  if (loading) {
    return <ProductLandingSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => navigate("/")} variant="outline">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const mainImage = product.images?.cover?.url || "/placeholder-product.jpg";
  const productFiles = product.files || [];
  const creator = product.creator || {};
  // Support multiple theme data sources: preview mock, published product, or fallback
  const themeValue = product?.previewMode 
    ? (product?.themeStyle || product?.advanced?.themeStyle || 'default')  // Preview mode
    : (product?.advanced?.themeStyle || product?.themeStyle || 'default'); // Published mode
  const themeStyles = getThemeStyles(themeValue);
  
  // Optional sections data
  const testimonials = product?.optionalSections?.testimonialsData || [];
  const faqs = product?.optionalSections?.faqData || [];
  const aboutMe = product?.optionalSections?.aboutMeData || {};

  return (
    <div className={`min-h-screen ${themeStyles.background}`}>
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">
                  {creator.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="text-gray-600">
                by{" "}
                <span className="font-medium text-gray-900">
                  {creator.name || creator.username}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Built with{" "}
              <a
                href="https://superlinks.ai"
                target="_blank"
                rel="noopener noreferrer"
                className={`font-semibold text-gray-900 ${themeStyles.hover} transition-colors`}
              >
                Superlinks
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${previewMode === 'mobile' ? 'max-w-none px-4 py-4' : 'max-w-7xl px-4 sm:px-6 lg:px-8 py-8'} mx-auto`}>
        <div className={`grid ${previewMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-4'} ${previewMode === 'mobile' ? 'gap-4' : 'gap-8'}`}>
          {/* Main Content Area */}
          <div className={`${previewMode === 'mobile' ? '' : 'lg:col-span-3'} order-1 lg:order-1`}>
            <div className={`${previewMode === 'mobile' ? 'space-y-4' : 'space-y-8'}`}>
              {/* Product Hero Image */}
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border">
                <img
                  src={mainImage}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder-product.jpg";
                  }}
                />
              </div>

              {/* Product Title */}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {product.title}
                </h1>
              </div>

              {/* Product Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">About This Product</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    {product.description ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: product.description,
                        }}
                      />
                    ) : (
                      <p className="text-gray-600">No description available.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* What's Included */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">What's Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Instant digital download</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Lifetime access</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Commercial use license</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Email support</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonials */}
              {testimonials.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center space-x-2">
                      <MessageCircle className="h-5 w-5" />
                      <span>What People Say</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {testimonials.map((testimonial, index) => (
                        <div
                          key={index}
                          className={`p-6 rounded-lg border ${themeStyles.border} ${themeStyles.background}`}
                        >
                          <div className="flex items-center space-x-1 mb-3">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < testimonial.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <blockquote className="text-gray-700 mb-4 italic">
                            "{testimonial.feedback || testimonial.testimonial}"
                          </blockquote>
                          <div className="flex items-center space-x-3">
                            {testimonial.avatar ? (
                              <img
                                src={testimonial.avatar}
                                alt={testimonial.name}
                                className="w-10 h-10 rounded-full"
                              />
                            ) : (
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${themeStyles.primary}`}>
                                <span className="text-white font-medium">
                                  {testimonial.name?.charAt(0)?.toUpperCase() || "T"}
                                </span>
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900">{testimonial.name}</p>
                              {(testimonial.role || testimonial.position) && (
                                <p className="text-sm text-gray-600">
                                  {testimonial.role || testimonial.position}
                                  {testimonial.company && `, ${testimonial.company}`}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* FAQ Section */}
              {faqs.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center space-x-2">
                      <HelpCircle className="h-5 w-5" />
                      <span>Frequently Asked Questions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {faqs.map((faq, index) => (
                        <Collapsible.Root
                          key={index}
                          open={openFaqIndex === index}
                          onOpenChange={(open) => setOpenFaqIndex(open ? index : null)}
                        >
                          <Collapsible.Trigger className={`w-full flex items-center justify-between p-4 text-left rounded-lg border ${themeStyles.border} hover:bg-gray-50 transition-colors`}>
                            <span className="font-medium text-gray-900">{faq.question}</span>
                            {openFaqIndex === index ? (
                              <ChevronUp className="h-4 w-4 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            )}
                          </Collapsible.Trigger>
                          <Collapsible.Content className="px-4 pb-4">
                            <p className="text-gray-600">{faq.answer}</p>
                          </Collapsible.Content>
                        </Collapsible.Root>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* About Me Section */}
              {aboutMe.enabled && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">{aboutMe.title || "About the Creator"}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-700">{aboutMe.description}</p>
                      {aboutMe.socialLinks && aboutMe.socialLinks.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Connect with me:</h4>
                          <div className="flex flex-wrap gap-3">
                            {aboutMe.socialLinks.map((link, index) => (
                              <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg border ${themeStyles.border} hover:bg-gray-50 transition-colors`}
                              >
                                {getSocialIcon(link.platform)}
                                <span className="text-sm font-medium capitalize">{link.platform}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Reviews */}
              {reviews.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Customer Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {reviews.slice(0, 3).map((review, index) => (
                        <div
                          key={index}
                          className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0"
                        >
                          <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-gray-600 font-medium">
                                {review.customerName
                                  ?.charAt(0)
                                  ?.toUpperCase() || "A"}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-medium text-gray-900">
                                  {review.customerName || "Anonymous"}
                                </h4>
                                <div className="flex space-x-1">
                                  {Array.from({ length: 5 }, (_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${
                                        i < review.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-gray-600">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className={`${previewMode === 'mobile' ? '' : 'lg:col-span-1'} order-2 lg:order-2`}>
            <div className={`space-y-6 ${previewMode === 'mobile' ? '' : 'lg:sticky lg:top-24'}`}>
              {/* Product Info Card */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Product Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Price</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(
                        product.price?.amount || 0,
                        product.price?.currency
                      )}
                    </span>
                  </div>
                  <Button
                    onClick={handlePurchase}
                    className={`w-full h-12 text-base font-semibold ${themeStyles.primary}`}
                    size="lg"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Buy Now
                  </Button>
                  <div className="text-center text-sm text-gray-500">
                    <div className="flex items-center justify-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Instant download</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Files Included */}
              {productFiles.length > 0 && (
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Files Included</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {productFiles.map((file, index) => (
                        <div
                          key={index}
                          className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedFileIndex === index
                              ? "bg-blue-50 border-blue-200"
                              : "border-gray-200"
                          }`}
                          onClick={() => handleFileClick(file, index)}
                        >
                          {getFileIcon(file.name)}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {file.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatFileSize(file.size)}
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Creator Profile */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">About Creator</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">
                        {creator.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {creator.name || creator.username}
                      </h3>
                      {creator.bio && (
                        <p className="text-sm text-gray-600 mt-1">
                          {creator.bio}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>Creator</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>Joined 2024</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews Summary */}
              {reviewsSummary.totalReviews > 0 && (
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {reviewsSummary.averageRating.toFixed(1)}
                      </div>
                      <div className="flex justify-center space-x-1 mb-2">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.round(reviewsSummary.averageRating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">
                        {reviewsSummary.totalReviews} reviews
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* File Preview Modal */}
      <FilePreviewModal
        file={selectedFile}
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        onDownload={handleFileDownload}
      />
    </div>
  );
}

export default ProductLandingPageV2;
