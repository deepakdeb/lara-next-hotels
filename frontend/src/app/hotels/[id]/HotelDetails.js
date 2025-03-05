"use client";
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";

export default function HotelDetails({ hotel, params }) {
  const shareUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/hotels/${params.id}`;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-header bg-info text-white text-center">
              <h3 className="mb-0">{hotel.name}</h3>
            </div>
            <div className="card-body p-4">
              <img src={hotel.image_url || "/placeholder.jpg"} className="img-fluid mb-3 rounded" alt={hotel.name} />
              <p><strong>Address:</strong> {hotel.address}</p>
              <p><strong>Cost per night:</strong> ${hotel.cost_per_night}</p>
              <p><strong>Available rooms:</strong> {hotel.available_rooms}</p>
              <p><strong>Average rating:</strong> {hotel.average_rating || "Not rated yet"}</p>
              <div className="mt-4 text-center">
                <h4 className="mb-3">Share this Hotel</h4>
                <div className="d-flex justify-content-center">
                  <FacebookShareButton url={shareUrl} className="mx-2">
                    <div role="button" tabIndex="0" className="btn btn-primary">
                      Facebook
                    </div>
                  </FacebookShareButton>
                  <TwitterShareButton url={shareUrl} className="mx-2">
                    <div role="button" tabIndex="0" className="btn btn-info">
                      Twitter
                    </div>
                  </TwitterShareButton>
                  <WhatsappShareButton url={shareUrl} className="mx-2">
                    <div role="button" tabIndex="0" className="btn btn-success">
                      WhatsApp
                    </div>
                  </WhatsappShareButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}